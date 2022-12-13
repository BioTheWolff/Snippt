import { Body, Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { BypassJwtAuth } from '../decorators/bypass-jwt-auth.decorator';
import { Response as ResponseType } from 'express';
import { RequestWithUser } from '../types/request-with-user.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  // TODO: restrict to NOT logged-in users
  @Post('register')
  @BypassJwtAuth()
  async register(@Body() userInfo: CreateUserDto, @Response({ passthrough: true }) res: ResponseType) {
    return await this.authService.register(userInfo, res);
  }

  // TODO: refuse if user is disabled (only if not admin)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @BypassJwtAuth()
  async login(@Request() req: RequestWithUser, @Response({ passthrough: true }) res: ResponseType) {
    return this.authService.login(req.user, res);
  }


  // TODO: JWT refresh token?
  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status(@Request() req: RequestWithUser) {
    return { status: "OK", expiresIn: req.user.jwtExpirationDate - new Date().getTime()/1000 };
  }
}
