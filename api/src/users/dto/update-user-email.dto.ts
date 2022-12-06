import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";


export class UpdateUserEmailDto extends PickType(CreateUserDto, ['email'] as const) {
    static isEmpty(dto) {
        return !dto.email
    }
}