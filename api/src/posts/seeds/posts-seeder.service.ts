import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersSeederService } from "../../users/seeds/users-seeder.service";
import { Repository } from "typeorm";
import { Post } from "../entities/post.entity";
import { postsSeeds } from "./posts.seeds";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class PostsSeederService {
    constructor (
        @InjectRepository(Post) private readonly repository: Repository<Post>,
        private readonly usersSeeder: UsersSeederService
    ) {}

    async create(): Promise<Post[]> {
        const users = await this.usersSeeder.create();

        return Promise.all(postsSeeds.map(async (e) => {
            const {author, ...dto} = e;
            
            let post = this.repository.create(dto);
            post.author = this.findUserByHandle(users, author);
            return await this.repository.save(post);
        }));
    }

    private findUserByHandle(users: User[], handle: string): User {
        return users.find((e) => e.handle == handle);
    }

    async drop() {
        return await this.repository.createQueryBuilder().delete().execute();
    }
}