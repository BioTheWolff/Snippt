import { ApiProperty } from "@nestjs/swagger";

export class JsonStatusResponse {
    @ApiProperty()
    status: string;
}

export class JsonLoginResponse {
    @ApiProperty()
    handle: string;

    @ApiProperty()
    display_name: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ default: false })
    admin: boolean;
};

export class ValidationErrorResponse {
    @ApiProperty({ default: 400 })
    status: number;

    @ApiProperty()
    message: [ string ];
}

export class AuthStatusResponse {
    @ApiProperty({ default: "OK" })
    status: string;

    @ApiProperty({ description: "The number of seconds before the token expires" })
    expiresIn: number;
}