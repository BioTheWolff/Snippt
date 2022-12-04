import { Controller, Get, Body, Patch, Param, Post, NotFoundException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LowercasePipe } from 'src/pipes/lowercase.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: create the "create user"/register? in auth module
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // TODO: implement finding users by who they follow

  @Get(':handle')
  @ApiOperation({ summary: "Find a user by their handle" })
  @ApiResponse({ status: 200, description: "The found user" })
  @ApiNotFoundResponse({ description: "If the user was not found" })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('handle', LowercasePipe) handle: string) {
    let user = await this.usersService.findOne(handle);
    if (user) {
      return user;
    }
    else {
      throw new NotFoundException();
    }
  }

  // TODO: PROTECT IT WITH GUARDS
  @Patch(':handle')
  @ApiOperation({ summary: "Update a user" })
  async update(@Param('handle') handle: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(handle, updateUserDto);
  }

  // TODO: create a "delete" route that would disable the user
}
