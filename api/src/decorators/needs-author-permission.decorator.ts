import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PostAuthorPermissionGuard } from '../auth/guards/permissions/post-author-permission.guard';
import { PERM_ADMIN_OVERRIDE, PERM_USER_PROPERTY } from './permission.decorator.util';

export function NeedsAuthorPermission(
  options?: {user_property?: string, allow_admins?: boolean}
) {
  return applyDecorators(
    SetMetadata(PERM_USER_PROPERTY, options?.user_property ?? "id"),
    SetMetadata(PERM_ADMIN_OVERRIDE, options?.allow_admins ?? true),
    UseGuards(PostAuthorPermissionGuard),
  );
}
