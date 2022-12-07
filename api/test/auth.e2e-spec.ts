import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmSqliteTestingModule } from '../src/database/typeorm-sqlite-testing';
import { User } from '../src/users/entities/user.entity';
import { AuthModule } from '../src/auth/auth.module';
import { usersSeeds } from '../src/users/seeds/users-seeds';

describe('Users', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSqliteTestingModule([User]), AuthModule],
      providers: []
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // REGISTER
  it('should register a new user', () => {
    return expect(false).toBeTruthy();
  });

  it('should not register on duplicate handle', () => {
    return expect(false).toBeTruthy();
  })

  it('should not register on duplicate email', () => {
    return expect(false).toBeTruthy();
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
