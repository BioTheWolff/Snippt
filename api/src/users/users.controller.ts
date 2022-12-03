import { Controller, Get } from '@nestjs/common';

@Controller('api/users')
export class UsersController {
    @Get()
    getUsers() {
        return "test\n";
    }
}
