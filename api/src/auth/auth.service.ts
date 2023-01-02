import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { responseMessages } from '../response-messages';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { Response as ResponseType } from 'express';

@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(userInfo: CreateUserDto, response: ResponseType) {
        let user = await this.usersService.create(userInfo);
        if (user) {
            this.setAuthenticationToken(user, response);
            return this.userDetails(user);
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

    async login(user: User, response: ResponseType) {
        this.setAuthenticationToken(user, response);
        return this.userDetails(user);
    }

    async logout(response: ResponseType) {
        const date = new Date();
        date.setSeconds(date.getSeconds() + 10);

        response.cookie('token', '', { 
            expires: date,
            httpOnly: true,
            sameSite: true
        })
        return { "status": "logged-out" }
    }

    async setAuthenticationToken(user: User, response: ResponseType) {
        // TODO: simplify payload to switch to cookie
        const payload = {
            sub: user.id,
            handle: user.handle
        };

        const token = this.jwtService.sign(payload);

        response.cookie('token', token, { 
            expires: new Date(this.jwtService.decode(token)['exp']*1000),
            httpOnly: true,
            sameSite: true
        });
    }

    userDetails(user: User) {
        return {
            handle: user.handle,
            display_name: user.display_name,
            email: user.email,
            admin: user.admin,
        };
    }
}
