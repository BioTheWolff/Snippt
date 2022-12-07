import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmSqliteTestingModule } from '../database/typeorm-sqlite-testing';
import { User } from './entities/user.entity';
import { usersSeeds } from './seeds/users-seeds';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSqliteTestingModule([User])],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a user and find it', async () => {
    await service.create(usersSeeds[0]);
    expect(await service.findOne(usersSeeds[0].handle)).toBeTruthy()
  })

  it('should hash the password', async () => {
    let user = await service.create(usersSeeds[0]);
    expect(user.password == usersSeeds[0].password).toBeFalsy()
  })

  it('should have the correct hash', async () => {
    let user = await service.create(usersSeeds[0]);
    expect(await service._password_compare(usersSeeds[0].password, user.password)).toBeTruthy()
  })

  it('should not find a user that was not created', async () => {
    expect(await service.findOne(usersSeeds[0].handle)).toBeFalsy()
  })

  it('should update the user\'s details', async () => {
    let details = {
      handle: "newhandle",
      display_name: "My Test"
    };

    let user = await service.create(usersSeeds[0]);
    expect(await service.updateInfo(user.id, details)).toBe(details);
    
    let fetch;
    expect((fetch = await service.findOne(details.handle))).toBeTruthy();

    expect({ handle: fetch.handle, display_name: fetch.display_name }).toEqual(details);
  })

  it('should update the user\'s email', async () => {
    let email = { email: "mynewmail@example.com" };

    let user = await service.create(usersSeeds[0]);
    expect(await service.updateEmail(user.id, email)).toBe(email);

    let fetch = await service.findOne(user.handle);
    expect(fetch.email).toBe(email.email);
  })

  it('should update the user\'s password', async () => {
    let pass = {
      password: usersSeeds[0].password,
      new_password: "azertyuiop",
      new_password_confirm: "azertyuiop"
    };

    let user = await service.create(usersSeeds[0]);
    expect(await service.updatePassword(user.id, pass)).toBe("OK");

    let fetch = await service.findOne(user.handle);
    expect(await service._password_compare(pass.new_password, fetch.password)).toBeTruthy();
  })
});
