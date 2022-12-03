import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: create the "create user"/register? in auth module

  // TODO: implement finding users by who they follow

  @Get(':handle')
  @ApiOperation({ summary: "Find a user by their handle" })
  @ApiResponse({ status: 200, description: "The found user" })
  @ApiResponse({ status: 404, description: "If the user was not found" })
  findOne(@Param('handle') handle: string) {
    return this.usersService.findOne(handle);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a user" })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // TODO: create a "delete" route that would disable the user
}
