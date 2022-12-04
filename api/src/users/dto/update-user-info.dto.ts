import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserInfoDto extends PartialType(
    OmitType(CreateUserDto, ['password', 'email'] as const),
  ) {
    isEmpty() {
      return !(this.display_name || this.handle);
    }
  }
