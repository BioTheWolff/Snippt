import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, Length, IsAlphanumeric, Validate } from 'class-validator';
import { HandleValidator } from 'src/validators/handle.validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    @Validate(HandleValidator)
    @Transform(({ value }) => value.toLowerCase())
    handle: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 40)
    display_name: string;
    
    @IsEmail()
    @IsNotEmpty()
    @Length(6, 80)
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    // TODO: add password validation on strength (a-zA-Z.; etc)
    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    password_confirm: string;
}
