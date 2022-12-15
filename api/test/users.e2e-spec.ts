import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmSqliteTestingModule } from '../src/database/typeorm-sqlite-testing';
import { User } from '../src/users/entities/user.entity';
import { UsersSeederService } from '../src/users/seeds/users-seeder.service';
import { followersForHandle, followingsForHandle, usersSeeds } from '../src/users/seeds/users-seeds';
import { getBodyFromError, loginAndGetToken } from './utils';
import { responseMessages } from '../src/response-messages';
let _async = require('async');
import * as cookieParser from 'cookie-parser';
import { Post } from '../src/posts/entities/post.entity';

describe('Users', () => {
  let app: INestApplication;
  let seeder: UsersSeederService;

  let users: User[]
  let jwt_bearer: string


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSqliteTestingModule([User, Post]), UsersModule],
      providers: [UsersSeederService]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    await app.init();

    seeder = moduleFixture.get<UsersSeederService>(UsersSeederService);
  });

  beforeEach(async () => {
    users = await seeder.create(true);
    jwt_bearer = await loginAndGetToken(app, usersSeeds[0].email, usersSeeds[0].password);
  })

  afterEach(async () => {
    await seeder.drop();
  })

  
  // PROFILE
  it('should 200 on found profile', () => {
    return request(app.getHttpServer())
      .get(`/users/${users[0].handle}?relations=false`)
      .expect({
        handle: users[0].handle,
        display_name: users[0].display_name
      });
  });

  // TODO: test following system /follow and /unfollow
  it('should find the correct relations on profile', async () => {
    for (let index in users) {
      const response = await request(app.getHttpServer())
        .get(`/users/${users[index].handle}`);
      const body = response.body;
      
      expect(body.handle).toBe(users[index].handle);
      expect(body.display_name).toBe(users[index].display_name);

      // followings
      for(let item of followingsForHandle(users[index].handle)) {
        expect(body.following.find((e) => e.handle == item.handle)).toBeTruthy();
      }

      // followers
      for(let item of followersForHandle(users[index].handle)) {
        expect(body.followers.find((e) => e.handle == item.handle)).toBeTruthy();
      }
    }
  })

  it('should 404 on non-existing profile', () => {
    return request(app.getHttpServer())
      .get('/users/notfound')
      .expect(404)
      .expect(getBodyFromError(404))
  })


  // UPDATE DETAILS
  it('should update details', (done) => {
    let new_handle = { handle: "mysupertest" };

    return _async.series([
      function (cb) { 
        request(app.getHttpServer())
          .patch(`/users/${users[0].id}/details`)
          .set("Authorization", jwt_bearer)
          .send(new_handle)
          .expect(new_handle, cb)
      },
      function (cb) {
        request(app.getHttpServer())
          .get(`/users/${new_handle.handle}?relations=false`)
          .expect(200)
          .expect({ handle: new_handle.handle, display_name: users[0].display_name }, cb)
      }
    ], done);
  })

  it('should update details even if same', () => {
    let new_handle = { handle: users[0].handle };
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/details`)
      .set("Authorization", jwt_bearer)
      .send(new_handle)
      .expect(200)
      .expect(new_handle);
  })

  it('should not update details on empty body', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/details`)
      .set("Authorization", jwt_bearer)
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.EMPTY_MODIF_DTO));
  })

  it('should not update details on existing handle', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/details`)
      .set("Authorization", jwt_bearer)
      .send({ handle: users[1].handle })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.HANDLE_IN_USE));
  })

  it('should not see user doesn\'t exist when updating details if not admin', () => {
    return request(app.getHttpServer())
      .patch(`/users/-1/details`)
      .set("Authorization", jwt_bearer)
      .send({ handle: "superlongtest" })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.TARGET_NOT_SELF));
  })

  it('should not update details of non-existing user', async () => {
    const token = await loginAndGetToken(app, usersSeeds[1].email, usersSeeds[1].password);

    return request(app.getHttpServer())
      .patch(`/users/-1/details`)
      .set("Authorization", token)
      .send({ handle: "superlongtest" })
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.UPDATE_NONEXIST_USER));
  })

  it('should not update details of another user', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[1].id}/details`)
      .set("Authorization", jwt_bearer)
      .send({ handle: "superlongtest" })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.TARGET_NOT_SELF));
  })

  it('should update details of another user IF ADMIN', async () => {
    const token = await loginAndGetToken(app, usersSeeds[1].email, usersSeeds[1].password);

    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/details`)
      .set("Authorization", token)
      .send({ display_name: "Should work!" })
      .expect(200)
      .expect({ display_name: "Should work!" });
  })


  // UPDATE EMAIL
  it('should update email', () => {
    let new_email = { email: "brandnew@email.com" };

    // TODO: check returned email is correct from private profile route once implemented
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/email`)
      .set("Authorization", jwt_bearer)
      .send(new_email)
      .expect(200)
      .expect(new_email);
  })

  it('should update email even if same', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/email`)
      .set("Authorization", jwt_bearer)
      .send({ email: users[0].email })
      .expect(200);
  })

  it('should not update email if already taken', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/email`)
      .set("Authorization", jwt_bearer)
      .send({ email: users[1].email })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.EMAIL_IN_USE));
  })

  it('should not see user doesn\'t exist when updating email if not admin', () => {
    return request(app.getHttpServer())
      .patch(`/users/-1/email`)
      .set("Authorization", jwt_bearer)
      .send({ email: "nope@example.com" })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.TARGET_NOT_SELF));
  })

  it('should not update email of non-existing user', async () => {
    const token = await loginAndGetToken(app, usersSeeds[1].email, usersSeeds[1].password);

    return request(app.getHttpServer())
      .patch(`/users/-1/email`)
      .set("Authorization", token)
      .send({ email: users[1].email })
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.UPDATE_NONEXIST_USER));
  })

  it('should not update email on empty body', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/email`)
      .set("Authorization", jwt_bearer)
      .expect(400);
  })

  it('should not update email of another user', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[1].id}/email`)
      .set("Authorization", jwt_bearer)
      .send({ email: "any@example.com" })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.TARGET_NOT_SELF));
  })

  it('should update email of another user IF ADMIN', async () => {
    const token = await loginAndGetToken(app, usersSeeds[1].email, usersSeeds[1].password);

    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/email`)
      .set("Authorization", token)
      .send({ email: "notadmin@example.com" })
      .expect(200)
      .expect({ email: "notadmin@example.com" });
  })


  // UPDATE PASSWORD
  it('should update password', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/password`)
      .set("Authorization", jwt_bearer)
      .send({
        password: usersSeeds[0].password,
        new_password: "azertyuiop",
        new_password_confirm: "azertyuiop"
      })
      .expect(200)
      .expect("OK");
  })

  it('should not update password on empty body', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/password`)
      .set("Authorization", jwt_bearer)
      .expect(400);
  })

  it('should not see user doesn\'t exist when updating password if not admin', () => {
    return request(app.getHttpServer())
      .patch(`/users/-1/password`)
      .set("Authorization", jwt_bearer)
      .send({
        password: usersSeeds[0].password,
        new_password: "azertyuiop",
        new_password_confirm: "azertyuiop"
      })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.TARGET_NOT_SELF));
  })

  it('should not update password of non-existing user', async () => {
    const token = await loginAndGetToken(app, usersSeeds[1].email, usersSeeds[1].password);

    return request(app.getHttpServer())
      .patch(`/users/-1/password`)
      .set("Authorization", token)
      .send({
        password: usersSeeds[0].password,
        new_password: "azertyuiop",
        new_password_confirm: "azertyuiop"
      })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.TARGET_NOT_SELF));
  })

  it('should not update password on mismatched new password confirm', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/password`)
      .set("Authorization", jwt_bearer)
      .send({
        password: usersSeeds[0].password,
        new_password: "azertyuiop",
        new_password_confirm: "azertyuiopp"
      })
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.NEW_PASS_MISMATCH));
  })

  it('should not update password on wrong current password', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/password`)
      .set("Authorization", jwt_bearer)
      .send({
        password: "wrongpassword",
        new_password: "azertyuiop",
        new_password_confirm: "azertyuiop"
      })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.WRONG_OLD_PASS));
  })

  it('should not update password of another user EVEN IF ADMIN', async () => {
    const token = await loginAndGetToken(app, usersSeeds[1].email, usersSeeds[1].password);

    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/password`)
      .set("Authorization", token)
      .send({
        password: usersSeeds[0].password,
        new_password: "azertyuiop",
        new_password_confirm: "azertyuiop"
      })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.TARGET_NOT_SELF));
  })
});
