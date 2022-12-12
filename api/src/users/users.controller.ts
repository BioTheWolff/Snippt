import { Controller, Get, Body, Patch, Param, Post, NotFoundException, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LowercasePipe } from '../pipes/lowercase.pipe';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { Public } from '../decorators/public.decorator';
import { NeedsOwnerPermission } from '../decorators/needs-owner-permission.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: implement finding users by who they follow

  @Public()
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
  @NeedsOwnerPermission()
  @ApiOperation({ summary: "Update a user's public details" })
  async updateDetails(@Param('id', ParseIntPipe) id: number, @Body() updateUserDetailsDto: UpdateUserDetailsDto) {
    return await this.usersService.updateInfo(id, updateUserDetailsDto);
  }

  @Patch(':id/email')
  @NeedsOwnerPermission()
  @ApiOperation({ summary: "Update a user's email" })
  async updateEmail(@Param('id', ParseIntPipe) id: number, @Body() updateUserEmailDto: UpdateUserEmailDto) {
    return await this.usersService.updateEmail(id, updateUserEmailDto);
  }

  @Patch(':id/password')
  @NeedsOwnerPermission({ allow_admins: false })
  @ApiOperation({ summary: "Update a user's password" })
  async updatePassword(@Param('id', ParseIntPipe) id: number, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return await this.usersService.updatePassword(id, updateUserPasswordDto)
  }

  // TODO: create a "delete" route that would disable the user
}
