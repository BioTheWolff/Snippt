import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { responseMessages } from '../response-messages';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(userInfo: CreateUserDto) {
        let user = await this.usersService.create(userInfo);
        if (user) {
            return { handle: user.handle, token: (await this.login(user)).token };
        } else {
            throw new BadRequestException(responseMessages.REGISTRATION_FAILED);
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findOneEmail(email);
        if (!user) {
            return null;
        }

        if(await this.usersService.isPasswordCorrect(user, password)) {
            let {password, ...result} = user;
            return result;
        }
    }

    async login(user: User) {
        const payload = {
            sub: user.id,
            handle: user.handle,
            display_name: user.display_name,
            email: user.email
        };

        return {
            token: this.jwtService.sign(payload)
        };
    }
}
