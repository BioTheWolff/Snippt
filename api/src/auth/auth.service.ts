import { BadRequestException, Injectable } from '@nestjs/common';
import { responseMessages } from '../response-messages';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService
    ) {}

    async register(userInfo: CreateUserDto) {
        let user = await this.usersService.create(userInfo);
        if (user) {
            return { handle: user.handle };
        } else {
            throw new BadRequestException(responseMessages.REGISTRATION_FAILED);
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findOneEmail(email);
        if(await this.usersService._password_compare(password, user.password)) {
            let {password, ...result} = user;
            return result;
        }
    }
}
