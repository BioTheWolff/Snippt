import { PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { CreateUserDto } from "./create-user.dto";


export class UpdateUserPasswordDto extends PickType(CreateUserDto, ['password'] as const) {
    @IsString()
    @IsNotEmpty()
    @Length(8)
    new_password: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    new_password_confirm: string;
}