import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestBody {
    @ApiProperty({ default: "email@example.com" })
    email: string;

    @ApiProperty()
    password: string;
}