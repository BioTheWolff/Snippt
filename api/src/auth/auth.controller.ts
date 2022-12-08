import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  // TODO: restrict to NOT logged-in users
  @Post('register')
  async register(@Body() userInfo: CreateUserDto) {
    return await this.authService.register(userInfo);
  }

  // TODO: refuse if user is disabled (only if not admin)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }


  // TODO: JWT refresh token?
  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status(@Request() req) {
    return { status: "OK", expiresIn: req.user.jwtExp - new Date().getTime()/1000 };
  }
}
