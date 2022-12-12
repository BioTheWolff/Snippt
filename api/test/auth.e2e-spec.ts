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
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';

require('dotenv').config();

describe('Users', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmSqliteTestingModule([User]), 
        AuthModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '5s' },
        }),
      ],
      providers: []
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  // REGISTER
  it('should register a new user', async () => {
    let response = await request(app.getHttpServer())
      .post(`/auth/register`)
      .send(usersSeeds[0]);

    expect(response.statusCode).toBe(201);
    expect(response.body.handle).toBe(usersSeeds[0].handle);
  });

  it('should not register on duplicate handle', (done) => {
    let wrong_user = {...usersSeeds[1]};
    wrong_user.handle = usersSeeds[0].handle;

    return _async.series([
        function (cb) { 
          request(app.getHttpServer())
            .post(`/auth/register`)
            .send(usersSeeds[0])
            .expect(201, cb);
        },
        function (cb) { 
          request(app.getHttpServer())
            .post(`/auth/register`)
            .send(wrong_user)
            .expect(403)
            .expect(getBodyFromError(403, responseMessages.HANDLE_IN_USE), cb);
        }
    ], done)
  })

  it('should not register on duplicate email', (done) => {
    let wrong_user = {...usersSeeds[1]};
    wrong_user.email = usersSeeds[0].email;

    return _async.series([
      function (cb) { 
        request(app.getHttpServer())
          .post(`/auth/register`)
          .send(usersSeeds[0])
          .expect(201, cb);
      },
      function (cb) { 
        request(app.getHttpServer())
          .post(`/auth/register`)
          .send(wrong_user)
          .expect(403)
          .expect(getBodyFromError(403, responseMessages.EMAIL_IN_USE), cb);
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

  // JWT & LOGIN
  it('should set JWT on login by register', async () => {
    let response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(usersSeeds[0]);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();

    expect(jwtService.verify(response.body.token)).toBeTruthy();
  })

  it('should set JWT on login by credentials', async () => {
    // registration
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(usersSeeds[0]);

    // login
    let response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: usersSeeds[0].email,
        password: usersSeeds[0].password
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();

    expect(jwtService.verify(response.body.token)).toBeTruthy();
  })

  it('should not login on incorrect email', async () => {
    // registration
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(usersSeeds[0]);

    // login
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "wrong@example.com",
        password: usersSeeds[0].password
      })
      .expect(401);
  })

  it('should not login on incorrect password', async () => {
    // registration
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(usersSeeds[0]);

    // login
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: usersSeeds[0].email,
        password: "wrongpass"
      })
      .expect(401);
  })

  // LOGOUT
  it('should accept logout when connected', () => {

  })

  it('should refuse logout if not connected', () => {

  })

});
