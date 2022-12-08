import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { usersSeeds } from "./users-seeds";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeederService {
    constructor (
        @InjectRepository(User) private readonly repository: Repository<User>
    ) {}

    create(): Promise<User>[] {
        return usersSeeds.map(async (e) => {
            let user = this.repository.create(e);
            user.password = await bcrypt.hash(user.password, 10);
            return await this.repository.save(user);
        })
    }

    async drop() {
        return await this.repository.createQueryBuilder().delete().execute();
    }
}