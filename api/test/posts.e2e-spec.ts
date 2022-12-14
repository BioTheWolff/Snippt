import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as cookieParser from "cookie-parser";
import * as request from 'supertest';
import { PostsModule } from "../src/posts/posts.module";
import { PostsSeederService } from "../src/posts/seeds/posts-seeder.service";
import { TypeOrmSqliteTestingModule } from "../src/database/typeorm-sqlite-testing";
import { Post } from "../src/posts/entities/post.entity";
import { User } from "../src/users/entities/user.entity";
import { loginAndGetToken } from './utils';
import { UsersSeederService } from "../src/users/seeds/users-seeder.service";
import { usersSeeds } from "../src/users/seeds/users-seeds";
import { CreatePostDto } from "../src/posts/dto/create-post.dto";

require('dotenv').config();

describe('Posts', () => {
  let app: INestApplication;

  let seeder: PostsSeederService;
  let posts: Post[];

  let jwt_bearer: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmSqliteTestingModule([User, Post]), 
        PostsModule
      ],
      providers: [PostsSeederService, UsersSeederService]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    await app.init();

    seeder = moduleFixture.get<PostsSeederService>(PostsSeederService);
  });

  beforeEach(async () => {
    posts = await seeder.create();
    jwt_bearer = await loginAndGetToken(app, usersSeeds[0].email, usersSeeds[0].password);
  })

  afterEach(async () => {
    await seeder.drop();
  })

  it('should not create a post when anonymous', () => {
    return request(app.getHttpServer())
        .post('/posts')
        .expect(401)
  })

  it('should create a post when logged in', () => {
    const post: CreatePostDto = {
        title: "test",
        description: "test",
        language: "javascript",
        content: "test"
    };

    return request(app.getHttpServer())
        .post('/posts')
        .set("Authorization", jwt_bearer)
        .send(post)
        .expect(201);
  })

  it('should retrieve the first few posts', () => {})
});