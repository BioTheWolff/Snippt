import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as cookieParser from "cookie-parser";
import * as request from 'supertest';
import { PostsModule } from "../src/posts/posts.module";
import { PostsSeederService } from "../src/posts/seeds/posts-seeder.service";
import { TypeOrmSqliteTestingModule } from "../src/database/typeorm-sqlite-testing";
import { Post } from "../src/posts/entities/post.entity";
import { User } from "../src/users/entities/user.entity";
import { getBodyFromError, loginAndGetToken } from './utils';
import { UsersSeederService } from "../src/users/seeds/users-seeder.service";
import { usersSeeds } from "../src/users/seeds/users-seeds";
import { CreatePostDto } from "../src/posts/dto/create-post.dto";
import { responseMessages } from "../src/response-messages";
import { postsSeeds } from "../src/posts/seeds/posts.seeds";

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
    posts = await seeder.create(true);
    jwt_bearer = await loginAndGetToken(app, usersSeeds[0].email, usersSeeds[0].password);
  })


  // Creation
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


  // Update
  it('should not update a post when anonymous', () => {
    return request(app.getHttpServer())
        .patch('/posts/1')
        .expect(401)
  })

  it('should not update the post of someone else', () => {
    return request(app.getHttpServer())
        .patch(`/posts/${posts[1].id}`)
        .set('Authorization', jwt_bearer)
        .expect(403)
        .expect(getBodyFromError(403, responseMessages.TARGET_NOT_SELF))
  })

  it('should update the post if owned', () => {
    return request(app.getHttpServer())
        .patch(`/posts/${posts[0].id}`)
        .set('Authorization', jwt_bearer)
        .send({
            title: "My new title"
        })
        .expect(200)
        .expect({ title: "My new title" })
  })

  it('should update the post if admin', async () => {
    const token = await loginAndGetToken(app, usersSeeds[1].email, usersSeeds[1].password);

    return request(app.getHttpServer())
        .patch(`/posts/${posts[0].id}`)
        .set('Authorization', token)
        .send({
            title: "My new admin title"
        })
        .expect(200)
        .expect({ title: "My new admin title" })
  })


  // Read
  it('should retrieve the first few posts', () => {})

  it('should 200 on found post', async () => {
    const response = await request(app.getHttpServer())
        .get(`/posts/${posts[0].id}`);
    const body: Post = response.body;

    expect(response.statusCode).toBe(200);

    const {author: expectedHandle, _id: a, ...expectedDto} = postsSeeds[0];
    const {author: foundAuthor, id: b, ...foundDto} = body;

    expect(foundDto).toEqual(expectedDto);
    expect(foundAuthor.handle).toBe(expectedHandle);
  })

  it('should 404 on unknown post', () => {
    return request(app.getHttpServer())
        .get('/posts/-1')
        .expect(404)
        .expect(getBodyFromError(404))
  })


  // Delete
  it('should remove post if author', async () => {
    await request(app.getHttpServer())
        .delete(`/posts/${posts[0].id}`)
        .set('Authorization', jwt_bearer)
        .expect(200)
        .expect("OK");

    return request(app.getHttpServer())
        .get(`/posts/${posts[0].id}`)
        .expect(200)
        .expect({
            title: posts[0].title,
            deleted: true
        })
  })

  it('should remove post if admin', async () => {
    const token = await loginAndGetToken(app, usersSeeds[1].email, usersSeeds[1].password);

    await request(app.getHttpServer())
        .delete(`/posts/${posts[0].id}`)
        .set('Authorization', token)
        .expect(200)
        .expect("OK");

    return request(app.getHttpServer())
        .get(`/posts/${posts[0].id}`)
        .expect(200)
        .expect({
            title: posts[0].title,
            deleted: true
        })
  })

  it('should not remove post if not self', () => {
    return request(app.getHttpServer())
        .delete(`/posts/${posts[1].id}`)
        .set('Authorization', jwt_bearer)
        .expect(403)
        .expect(getBodyFromError(403, responseMessages.TARGET_NOT_SELF));
  })
});