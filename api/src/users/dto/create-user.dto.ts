import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
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

    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;
}
