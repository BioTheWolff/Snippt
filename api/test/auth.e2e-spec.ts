import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmSqliteTestingModule } from '../src/database/typeorm-sqlite-testing';
import { User } from '../src/users/entities/user.entity';
import { AuthModule } from '../src/auth/auth.module';
import { usersSeeds } from '../src/users/seeds/users-seeds';
import * as _async from 'async';
import { getBodyFromError } from './utils';
import { responseMessages } from '../src/response-messages';

describe('Users', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSqliteTestingModule([User]), AuthModule],
      providers: []
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  // REGISTER
  it('should register a new user', () => {
    return request(app.getHttpServer())
      .post(`/auth/register`)
      .send(usersSeeds[0])
      .expect(201)
      .expect({
        handle: usersSeeds[0].handle
      });
  });

  it('should not register on duplicate handle', (done) => {
    let wrong_user = {...usersSeeds[1]};
    wrong_user.handle = usersSeeds[0].handle;

    return _async.series([
        function (cb) { request(app.getHttpServer()).post(`/auth/register`).send(usersSeeds[0]) },
        function (cb) { 
            request(app.getHttpServer())
                .post(`/auth/register`)
                .send(wrong_user)
                .expect(403)
                .expect(getBodyFromError(403, responseMessages.HANDLE_IN_USE));
        }
    ], done)
  })

  it('should not register on duplicate email', (done) => {
    let wrong_user = {...usersSeeds[1]};
    wrong_user.email = usersSeeds[0].email;

    return _async.series([
        function (cb) { request(app.getHttpServer()).post(`/auth/register`).send(usersSeeds[0]) },
        function (cb) { 
            request(app.getHttpServer())
                .post(`/auth/register`)
                .send(wrong_user)
                .expect(403)
                .expect(getBodyFromError(403, responseMessages.HANDLE_IN_USE));
        }
    ], done)
  })

  it('should not register on handle validation fail', () => {
    let wrong_user = {...usersSeeds[0]};
    wrong_user.handle = "wrong@ handle";

    return request(app.getHttpServer())
      .post(`/auth/register`)
      .send(wrong_user)
      .expect(400);
  })

  // LOGIN
  it('should login on register', () => {
    return expect(false).toBeTruthy();
  })

  it('should login on correct credentials', () => {
    return expect(false).toBeTruthy();
  })

  it('should not login on incorrect email', () => {
    return expect(false).toBeTruthy();
  })

  it('should not login on incorrect password', () => {
    return expect(false).toBeTruthy();
  })

  // LOGOUT
  it('should accept logout when connected', () => {
    return expect(false).toBeTruthy();
  })

  it('should refuse logout if not connected', () => {
    return expect(false).toBeTruthy();
  })

  // JWT
  it('should set JWT on login by register', () => {
    return expect(false).toBeTruthy();
  })

  it('should set JWT on login by credentials', () => {
    return expect(false).toBeTruthy();
  })

  it('should remove JWT on logout', () => {
    return expect(false).toBeTruthy();
  })

});
