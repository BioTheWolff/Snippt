import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  // Restrict to NOT logged-in users
  @Post('register')
  async register(@Body() userInfo: CreateUserDto) {
    return await this.authService.register(userInfo);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
