import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmSqliteTestingApp, TypeOrmSqliteTestingModule } from '../src/database/typeorm-sqlite-testing';
import { User } from '../src/users/entities/user.entity';
import { UsersSeederService } from '../src/users/seeds/users-seeder.service';

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

  it('GET users/:handle on existing user should 200', () => {
    return request(app.getHttpServer())
      .get(`/users/${users[0].handle}`)
      .expect(200)
      .expect({
        handle: users[0].handle,
        display_name: users[0].display_name
      });
  });
});
