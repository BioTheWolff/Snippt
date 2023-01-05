import { Controller, Get, Body, Patch, Param, Post, NotFoundException, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, Request, ParseBoolPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { ApiBody, ApiExcludeEndpoint, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LowercasePipe } from '../pipes/lowercase.pipe';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { Public } from '../decorators/public.decorator';
import { NeedsOwnerPermission } from '../decorators/needs-owner-permission.decorator';
import { RequestWithUser } from '../types/request-with-user.type';
import { NeedsAdminPermission } from '../decorators/needs-admin-permission.decorator';
import { JsonStatusResponse } from '../types/api-responses.type';
import { ApiResponseUnauthorized } from '../decorators/api-responses.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @NeedsAdminPermission()
  @ApiExcludeEndpoint()
  async findAll() {
    return await this.usersService.findAll();
  }

  // User profile
  @Public()
  @Get(':handle')
  @ApiTags('user profile')
  @ApiOperation({ summary: "Find a user by their handle" })
  @ApiResponse({ status: 200, description: "Returns the found user" })
  @ApiNotFoundResponse({ description: "The user was not found" })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('handle', LowercasePipe) handle: string, 
    @Query('relations', new DefaultValuePipe(true), ParseBoolPipe) get_relations: boolean
  ) {
    let user = await this.usersService.findOne(handle, get_relations);
    if (user) {
      return user;
    }
    else {
      throw new NotFoundException();
    }
  }


  // Followers system
  @Post(':handle/follow')
  @ApiTags('user profile')
  @ApiOperation({ summary: "Follow the target user" })
  @ApiResponse({ status: 201, description: "The target user was followed" })
  @ApiResponseUnauthorized()
  async follow(@Request() req: RequestWithUser, @Param('handle') target_handle: string) {
    return await this.usersService.follow(req.user, target_handle);
  }

  @Post(':handle/unfollow')
  @ApiTags('user profile')
  @ApiOperation({ summary: "Unfollow the target user" })
  @ApiResponse({ status: 201, description: "The target user was unfollowed" })
  @ApiResponseUnauthorized()
  async unfollow(@Request() req: RequestWithUser, @Param('handle') target_handle: string) {
    return await this.usersService.unfollow(req.user, target_handle);
  }


  // User settings
  @Patch(':handle/details')
  @NeedsOwnerPermission({ route_param: 'handle', user_property: 'handle' })
  @ApiTags('user settings')
  @ApiOperation({ summary: "Update a user's public details" })
  @ApiBody({ description: 'All keys are optional', type: UpdateUserDetailsDto })
  @ApiResponseUnauthorized()
  async updateDetails(@Param('handle') handle: string, @Body() updateUserDetailsDto: UpdateUserDetailsDto) {
    return await this.usersService.updateInfo(handle, updateUserDetailsDto);
  }

  @Patch(':handle/email')
  @NeedsOwnerPermission({ route_param: 'handle', user_property: 'handle', allow_admins: false })
  @ApiTags('user settings')
  @ApiOperation({ summary: "Update a user's email" })
  @ApiResponseUnauthorized()
  async updateEmail(@Param('handle') handle: string, @Body() updateUserEmailDto: UpdateUserEmailDto) {
    return await this.usersService.updateEmail(handle, updateUserEmailDto);
  }

  @Patch(':handle/password')
  @NeedsOwnerPermission({ route_param: 'handle', user_property: 'handle', allow_admins: false })
  @ApiTags('user settings')
  @ApiOperation({ summary: "Update a user's password" })
  @ApiResponse({ 
    status: 200, 
    description: 'The password was successfully updated',
    type: JsonStatusResponse
  })
  @ApiResponseUnauthorized()
  async updatePassword(@Param('handle') handle: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return await this.usersService.updatePassword(handle, updateUserPasswordDto)
  }

  // TODO: create a "delete" route that would disable the user
  @Patch(':handle/status')
  @ApiExcludeEndpoint()
  async setStatus(
    @Param('handle') handle: string, 
    @Body('disabled', ParseBoolPipe) disabled: boolean
  ) {
    return await this.usersService.setStatus(handle, disabled);
  }
}
