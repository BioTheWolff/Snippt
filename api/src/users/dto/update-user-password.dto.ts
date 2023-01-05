import { PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { MatchesWithProperty } from "../../validators/match-other.validator";
import { CreateUserDto } from "./create-user.dto";


export class UpdateUserPasswordDto extends PickType(CreateUserDto, ['password'] as const) {
    @IsString()
    @IsNotEmpty()
    @Length(8)
    new_password: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    @MatchesWithProperty(UpdateUserPasswordDto, o => o.new_password)
    new_password_confirm: string;

    static isEmpty(dto) {
        return !(dto.password || dto.new_password || dto.new_password_confirm);
    }
}