import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { User } from './entities/user.entity';

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

  findOne(handle: string) {
    return this.usersRepository.findOneBy({handle: handle});
  }

  async updateInfo(id: number, updateUserInfoDto: UpdateUserInfoDto) {
    // if the update DTO is empty
    if (updateUserInfoDto.isEmpty()) {
      throw new HttpException("Not modified", HttpStatus.NOT_MODIFIED);
    }

    // getting the user to update
    let user = await this.usersRepository.findOneBy({id: id});
    if (!user) {
      throw new BadRequestException("User to update was not found");
    }

    // updating the user
    try {
      let result = await this.usersRepository.update({id: id}, updateUserInfoDto);
      if (result.affected > 0) {
        return updateUserInfoDto;
      } else {
        throw new HttpException("Not modified", HttpStatus.NOT_MODIFIED);
      }
    } catch (QueryFailedError) {
      // in case of duplicate key error
      throw new ForbiddenException("New handle is already taken")
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
