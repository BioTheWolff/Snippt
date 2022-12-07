import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDetailsDto extends PartialType(
    PickType(CreateUserDto, ['handle', 'display_name'] as const),
  ) {
    static isEmpty(dto: UpdateUserDetailsDto) {
      return !(dto.display_name || dto.handle);
    }
  }
