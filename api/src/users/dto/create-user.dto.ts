import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, Length, Validate } from 'class-validator';
import { MatchesWithProperty } from '../../validators/match-other.validator';
import { HandleValidator } from '../../validators/handle.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    @Validate(HandleValidator)
    @Transform(({ value }) => value.toLowerCase())
    @ApiProperty({ default: "my_handle" })
    handle: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 40)
    @ApiProperty({ default: "My display name" })
    display_name: string;
    
    @IsEmail()
    @IsNotEmpty()
    @Length(6, 80)
    @Transform(({ value }) => value.toLowerCase())
    @ApiProperty({ default: "email@example.com" })
    email: string;

    // TODO: add password validation on strength (a-zA-Z.; etc)
    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    @MatchesWithProperty(CreateUserDto, o => o.password)
    password_confirm: string;
}
