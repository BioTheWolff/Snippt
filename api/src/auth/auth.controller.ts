import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { BypassJwtAuth } from '../decorators/bypass-jwt-auth.decorator';
import { Response as ResponseType } from 'express';
import { RequestWithUser } from '../types/request-with-user.type';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthStatusResponse, JsonLoginResponse } from '../types/api-responses.type';
import { ApiResponseUnauthorized, ApiResponseValidationError } from '../decorators/api-responses.decorator';
import { LoginRequestBody } from '../types/api-request-bodies.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  // TODO: restrict to NOT logged-in users
  @Post('register')
  @BypassJwtAuth()
  @ApiTags('authentication')
  @ApiOperation({ summary: "Register a new account" })
  @ApiResponse({ 
    status: 201,
    description: 'The user was successfully registered and logged in to',
    type: JsonLoginResponse
  })
  @ApiResponseValidationError()
  async register(@Body() userInfo: CreateUserDto, @Response({ passthrough: true }) res: ResponseType) {
    return await this.authService.register(userInfo, res);
  }

  // TODO: refuse if user is disabled (only if not admin)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @BypassJwtAuth()
  @ApiTags('authentication')
  @ApiOperation({ summary: "Log into an existing account" })
  @ApiBody({ type: LoginRequestBody })
  @ApiResponse({ 
    status: 201,
    description: 'The user was successfully logged in to',
    type: JsonLoginResponse
  })
  @ApiResponseValidationError()
  async login(@Request() req: RequestWithUser, @Response({ passthrough: true }) res: ResponseType) {
    return this.authService.login(req.user, res);
  }

  @Get('logout')
  @ApiTags('authentication')
  @ApiOperation({ summary: "Log out of the current account" })
  @ApiResponse({ status: 200, description: 'The user was successfully logged out' })
  @ApiResponseUnauthorized()
  async logout(@Response({ passthrough: true }) res: ResponseType) {
    return this.authService.logout(res);
  }


  // TODO: JWT refresh token?
  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiTags('authentication')
  @ApiOperation({ summary: "Get current login status" })
  @ApiResponse({
    status: 200,
    description: "The current authentication status",
    type: AuthStatusResponse
  })
  @ApiResponseUnauthorized()
  async status(@Request() req: RequestWithUser) {
    return { status: "OK", expiresIn: req.user.jwtExpirationDate - new Date().getTime()/1000 };
  }
}
