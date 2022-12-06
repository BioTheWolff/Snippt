import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmSqliteTestingApp } from '../src/database/typeorm-sqlite-testing';
import { User } from '../src/users/entities/user.entity';

describe('Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmSqliteTestingApp([User]), UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET users/:handle on existing user should 200', () => {
    return request(app.getHttpServer())
      .get('/api/users/test')
      .expect(200)
      .expect("");
  });
});
