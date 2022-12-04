import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, ['password'] as const),
  ) {
    isEmpty() {
      return !(this.email || this.display_name || this.handle);
    }
  }
