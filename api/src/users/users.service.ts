import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { User } from './entities/user.entity';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { responseMessages } from '../response-messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    let user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOne(handle: string) {
    return await this.usersRepository.findOneBy({handle: handle});
  }

  async updateInfo(id: number, updateUserDetailsDto: UpdateUserDetailsDto) {
    // if the update DTO is empty
    if (UpdateUserDetailsDto.isEmpty(updateUserDetailsDto)) {
      throw new BadRequestException(responseMessages.EMPTY_MODIF_DTO);
    }

    // getting the user to update
    let user = await this.usersRepository.findOneBy({id: id});
    if (!user) {
      throw new BadRequestException(responseMessages.UPDATE_NONEXIST_USER);
    }

    // updating the user
    try {
      let result = await this.usersRepository.update({id: id}, updateUserDetailsDto);
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

  async updateEmail(id: number, updateUserEmailDto: UpdateUserEmailDto) {
    // if the update DTO is empty
    if (UpdateUserEmailDto.isEmpty(updateUserEmailDto)) {
      throw new BadRequestException(responseMessages.EMPTY_MODIF_DTO);
    }

    // getting the user to update
    let user = await this.usersRepository.findOneBy({id: id});
    if (!user) {
      throw new BadRequestException(responseMessages.UPDATE_NONEXIST_USER);
    }

    // updating the user
    try {
      let result = await this.usersRepository.update({id: id}, updateUserEmailDto);
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

  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    // if the update DTO is empty
    if (UpdateUserPasswordDto.isEmpty(updateUserPasswordDto)) {
      throw new BadRequestException(responseMessages.EMPTY_MODIF_DTO);
    }

    // checking new passwords are equal
    if (updateUserPasswordDto.new_password !== updateUserPasswordDto.new_password_confirm) {
      throw new BadRequestException(responseMessages.NEW_PASS_MISMATCH);
    }

    // getting the user to update
    let user = await this.usersRepository.findOneBy({id: id});
    if (!user) {
      throw new BadRequestException(responseMessages.UPDATE_NONEXIST_USER);
    }

    // checking old password matches DB
    if (user.password !== updateUserPasswordDto.password) {
      throw new ForbiddenException(responseMessages.WRONG_OLD_PASS);
    }


    // updating the user
    await this.usersRepository.update({id: id}, {password: updateUserPasswordDto.new_password});
    return "OK";
  }

  // TODO: implement remove
  remove(id: number) {
    return "NOK";
  }
}
