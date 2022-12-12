import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { followersSeeds, usersSeeds } from "./users-seeds";
import * as bcrypt from 'bcrypt';
import { exit } from "process";

@Injectable()
export class UsersSeederService {
    constructor (
        @InjectRepository(User) private readonly repository: Repository<User>
    ) {}

    async create(): Promise<User[]> {
        const users = await Promise.all(usersSeeds.map(async (e) => {
            let user = this.repository.create(e);
            user.password = await bcrypt.hash(user.password, 10);
            return await this.repository.save(user);
        }));

        await Promise.all(followersSeeds.map(async (e) => {
            let ufrom = await this.repository.findOneBy({ handle: e.from });
            let uto = await this.repository.findOneBy({ handle: e.to });

            ufrom.follow(uto);
            await this.repository.save(ufrom);
        }));

        return users;
    }

    async drop() {
        return await this.repository.createQueryBuilder().delete().execute();
    }
}