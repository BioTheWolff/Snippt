import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmSqliteTestingModule } from '../src/database/typeorm-sqlite-testing';
import { User } from '../src/users/entities/user.entity';
import { UsersSeederService } from '../src/users/seeds/users-seeder.service';
import { usersSeeds } from '../src/users/seeds/users-seeds';
import { getBodyFromError } from './utils';
import { responseMessages } from '../src/response-messages';
let _async = require('async');

describe('Users', () => {
  let app: INestApplication;
  let users: User[]

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSqliteTestingModule([User]), UsersModule],
      providers: [UsersSeederService]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    let seeder = moduleFixture.get<UsersSeederService>(UsersSeederService);
    users = await Promise.all(seeder.create());
  });

  // PROFILE
  it('should 200 on found profile', () => {
    return request(app.getHttpServer())
      .get(`/users/${users[0].handle}`)
      .expect(200)
      .expect({
        handle: users[0].handle,
        display_name: users[0].display_name
      });
  });

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
          .send(new_handle)
          .expect(200)
          .expect(new_handle, cb)
      },
      function (cb) {
        request(app.getHttpServer())
          .get(`/users/${new_handle.handle}`)
          .expect(200)
          .expect({ handle: new_handle.handle, display_name: users[0].display_name }, cb)
      }
    ], done);
  })

  it('should update details even if same', () => {
    let new_handle = { handle: users[0].handle };
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/details`)
      .send(new_handle)
      .expect(200)
      .expect(new_handle);
  })

  it('should not update details on empty body', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/details`)
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.EMPTY_MODIF_DTO));
  })

  it('should not update details on existing handle', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/details`)
      .send({ handle: users[1].handle })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.HANDLE_IN_USE));
  })

  it('should not update details of non-existing user', () => {
    return request(app.getHttpServer())
      .patch(`/users/-1/details`)
      .send({ handle: "superlongtest" })
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.UPDATE_NONEXIST_USER));
  })

  // UPDATE EMAIL
  it('should update email', () => {
    let new_email = { email: "brandnew@email.com" };

    // TODO: check returned email is correct from private profile route once implemented
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/email`)
      .send(new_email)
      .expect(200)
      .expect(new_email);
  })

  it('should update email even if same', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/email`)
      .send({ email: users[0].email })
      .expect(200);
  })

  it('should not update email if already taken', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/email`)
      .send({ email: users[1].email })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.EMAIL_IN_USE));
  })

  it('should not update email of non-existing user', () => {
    return request(app.getHttpServer())
      .patch(`/users/-1/email`)
      .send({ email: users[1].email })
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.UPDATE_NONEXIST_USER));
  })

  it('should not update email on empty body', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/email`)
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.EMPTY_MODIF_DTO));
  })

  // UPDATE PASSWORD
  it('should update password', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/password`)
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
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.EMPTY_MODIF_DTO));
  })

  it('should not update password of non-existing user', () => {
    return request(app.getHttpServer())
      .patch(`/users/-1/password`)
      .send({
        password: usersSeeds[0].password,
        new_password: "azertyuiop",
        new_password_confirm: "azertyuiop"
      })
      .expect(400)
      .expect(getBodyFromError(400, responseMessages.UPDATE_NONEXIST_USER));
  })

  it('should not update password on mismatched new password confirm', () => {
    return request(app.getHttpServer())
      .patch(`/users/${users[0].id}/password`)
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
      .send({
        password: "wrongpassword",
        new_password: "azertyuiop",
        new_password_confirm: "azertyuiop"
      })
      .expect(403)
      .expect(getBodyFromError(403, responseMessages.WRONG_OLD_PASS));
  })
});
