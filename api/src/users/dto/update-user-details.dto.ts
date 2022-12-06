import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDetailsDto extends PartialType(
    OmitType(CreateUserDto, ['password', 'email'] as const),
  ) {
    static isEmpty(dto: UpdateUserDetailsDto) {
      return !(dto.display_name || dto.handle);
    }
  }
