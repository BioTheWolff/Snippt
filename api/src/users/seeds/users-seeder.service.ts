import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { usersSeeds } from "./users-seeds";

@Injectable()
export class UsersSeederService {
    constructor (
        @InjectRepository(User) private readonly repository: Repository<User>
    ) {}

    create(): Promise<User>[] {
        return usersSeeds.map(async (e) => {
            return await this.repository.save(this.repository.create(e))
        })
    }
}