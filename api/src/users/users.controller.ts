import { Controller, Get, Body, Patch, Param, Post, NotFoundException, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LowercasePipe } from 'src/pipes/lowercase.pipe';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';

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
  @Patch(':id/details')
  @ApiOperation({ summary: "Update a user's public details" })
  async updateDetails(@Param('id', ParseIntPipe) id: number, @Body() updateUserDetailsDto: UpdateUserDetailsDto) {
    return await this.usersService.updateInfo(id, updateUserDetailsDto);
  }

  @Patch(':id/email')
  @ApiOperation({ summary: "Update a user's email" })
  async updateEmail(@Param('id', ParseIntPipe) id: number, @Body() updateUserEmailDto: UpdateUserEmailDto) {
    return await this.usersService.updateEmail(id, updateUserEmailDto);
  }

  // TODO: create a "delete" route that would disable the user
}
