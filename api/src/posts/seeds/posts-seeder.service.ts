import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersSeederService } from "../../users/seeds/users-seeder.service";
import { Repository } from "typeorm";
import { Post } from "../entities/post.entity";
import { answersSeeds, dislikesSeeds, likesSeeds, postsSeeds } from "./posts.seeds";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class PostsSeederService {
    constructor (
        @InjectRepository(Post) private readonly repository: Repository<Post>,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly usersSeeder: UsersSeederService
    ) {}

    async create(drop: boolean = false): Promise<Post[]> {
        if (drop) {
            await this.drop();
        }

        const users = await this.usersSeeder.create();
        const posts = await Promise.all(postsSeeds.map(async (e) => {
            const {author, ...dto} = e;
            
            let post = this.repository.create(dto);
            post.author = this.findUserByHandle(users, author);
            return await this.repository.save(post);
        }));

        // likes
        await Promise.all(likesSeeds.map(async (e) => {
            // must use findOneBy, else it tries to create a whole new entity
            // on save, and it crashes because of the primary key (obviously)
            const user = await this.usersRepository.findOneBy({ handle: e.user});
            user.likePost(posts[e.post]);
            return await this.usersRepository.save(user);
        }));

        // dislikes
        await Promise.all(dislikesSeeds.map(async (e) => {
            const user = await this.usersRepository.findOneBy({ handle: e.user});
            user.dislikePost(posts[e.post]);
            return await this.usersRepository.save(user);
        }));

        // answers
        const answers: Post[] = [];
        for (let e of answersSeeds) {
            const {author, parent, ...dto} = e;
            
            let post = this.repository.create(dto);
            post.author = this.findUserByHandle(users, author);
            post.parent = posts.find(e => {
                    let found = postsSeeds.find(e => e._id === parent);
                    if (found && e.title === found.title) return true;
                    else return false;
                })
                || answers.find(e => {
                    let found = answersSeeds.find(e => e._id === parent);
                    if (found && e.title === found.title) return true;
                    else return false;
                });
            answers.push(await this.repository.save(post));
        }

        return [...posts, ...answers];
    }

    private findUserByHandle(users: User[], handle: string): User {
        return users.find((e) => e.handle == handle);
    }

    async drop() {
        await this.repository.createQueryBuilder().delete().execute();
        await this.usersSeeder.drop();
    }
}