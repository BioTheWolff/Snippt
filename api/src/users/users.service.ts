import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { User } from './entities/user.entity';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { responseMessages } from '../response-messages';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Utils
  async _password_hash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 10);
  }

  async _password_compare(plain: string, hash: string) {
    return await bcrypt.compare(plain, hash);
  }

  async isPasswordCorrect(user: User, plain: string): Promise<Boolean> {
    return await this._password_compare(plain, user.password);
  }


  // Creation
  async create(createUserDto: CreateUserDto) {
    // check handle is available
    if (await this.usersRepository.findOneBy({ handle: createUserDto.handle })) {
      throw new ForbiddenException(responseMessages.HANDLE_IN_USE);
    }

    // check email is available
    if (await this.usersRepository.findOneBy({ email: createUserDto.email })) {
      throw new ForbiddenException(responseMessages.EMAIL_IN_USE);
    }

    // create user and hash password
    let user = this.usersRepository.create(createUserDto);
    user.password = await this._password_hash(user.password);

    return this.usersRepository.save(user);
  }


  // Search
  async findAll() {
    const users = await this.usersRepository.find({
      order: {
        created_at: 'DESC',
        updated_at: 'DESC',
      },
    });

    return users.map(user => ({
      id: user.id,
      handle: user.handle,
      display_name: user.display_name,
      email: user.email,
      disabled: user.disabled,
      admin: user.admin,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }))
  }

  async findOne(handle: string, get_relations: boolean = true) {
    return await this.usersRepository.findOne({
      relations: {
        following: get_relations,
        followers: get_relations,
        likes: get_relations,
        dislikes: get_relations,
        posts: get_relations,
      },
      where: { handle: handle }
    });
  }

  async findOneEmail(email: string) {
    return await this.usersRepository.findOneBy({email: email});
  }

  // Followers system
  async follow(user: User, target_handle: string) {
    // impossible to follow yourself
    if (user.handle === target_handle) {
      throw new ForbiddenException(responseMessages.FOLLOW_SELF_FORBIDDEN);
    }

    // getting the user to follow
    let target = await this.usersRepository.findOneBy({handle: target_handle});
    if (!target) {
      throw new BadRequestException(responseMessages.USER_NOT_FOUND);
    }

    user.follow(target);
    await this.usersRepository.save(user);

    return { "status": "OK" };
  }

  async unfollow(user: User, target_handle: string) {
    // getting the user to unfollow
    let target = await this.usersRepository.findOneBy({handle: target_handle});
    if (!target) {
      throw new BadRequestException(responseMessages.USER_NOT_FOUND);
    }

    user.unfollow(target);
    await this.usersRepository.save(user);

    return { "status": "OK" };
  }


  // Update
  async updateInfo(handle: string, updateUserDetailsDto: UpdateUserDetailsDto) {
    // if the update DTO is empty
    if (UpdateUserDetailsDto.isEmpty(updateUserDetailsDto)) {
      throw new BadRequestException(responseMessages.EMPTY_MODIF_DTO);
    }

    // getting the user to update
    // TODO: refactor with findOneByOrDie?
    let user = await this.usersRepository.findOneBy({handle: handle});
    if (!user) {
      throw new BadRequestException(responseMessages.UPDATE_NONEXIST_USER);
    }

    // updating the user
    try {
      let result = await this.usersRepository.update({handle: handle}, updateUserDetailsDto);
      if (result.affected > 0) {
        return updateUserDetailsDto;
      } else {
        throw new HttpException(responseMessages.NOT_MODIFIED, HttpStatus.NOT_MODIFIED);
      }
    } catch (e) {
      if (e instanceof QueryFailedError) {
        // in case of duplicate key error
        throw new ForbiddenException(responseMessages.HANDLE_IN_USE)
      } else {
        throw new ServiceUnavailableException(responseMessages.UKN_DB_ERROR)
      }
    }
  }

  async updateEmail(handle: string, updateUserEmailDto: UpdateUserEmailDto) {
    // getting the user to update
    let user = await this.usersRepository.findOneBy({handle: handle});
    if (!user) {
      throw new BadRequestException(responseMessages.UPDATE_NONEXIST_USER);
    }

    // updating the user
    try {
      let result = await this.usersRepository.update({handle: handle}, updateUserEmailDto);
      if (result.affected > 0) {
        return updateUserEmailDto;
      } else {
        throw new HttpException(responseMessages.NOT_MODIFIED, HttpStatus.NOT_MODIFIED);
      }
    } catch (e) {
      if (e instanceof QueryFailedError) {
        // in case of duplicate key error
        throw new ForbiddenException(responseMessages.EMAIL_IN_USE)
      } else {
        throw new ServiceUnavailableException(responseMessages.UKN_DB_ERROR)
      }
    }
  }

  async updatePassword(handle: string, updateUserPasswordDto: UpdateUserPasswordDto) {
    // getting the user to update
    let user = await this.usersRepository.findOneBy({handle: handle});
    if (!user) {
      throw new BadRequestException(responseMessages.UPDATE_NONEXIST_USER);
    }

    // checking old password matches DB
    if (!await this.isPasswordCorrect(user, updateUserPasswordDto.password)) {
      throw new ForbiddenException(responseMessages.WRONG_OLD_PASS);
    }

    // hashing password and updating user
    await this.usersRepository.update({handle: handle}, {
      password: await this._password_hash(updateUserPasswordDto.new_password)
    });
    return { "status": "OK" };
  }


  async setStatus(handle: string, disabled: boolean) {
    await this.usersRepository.update({handle: handle}, {disabled: disabled});
    return { "disabled": disabled };
  }
}
