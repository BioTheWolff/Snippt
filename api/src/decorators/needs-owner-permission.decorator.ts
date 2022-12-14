import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnerPermissionGuard } from '../auth/guards/permissions/owner-permission.guard';
import { PERM_ADMIN_OVERRIDE, PERM_ROUTE_PARAM, PERM_USER_PROPERTY } from './permission.decorator.util';

export function NeedsOwnerPermission(
  options?: {route_param?: string, user_property?: string, allow_admins?: boolean}
) {
  return applyDecorators(
    SetMetadata(PERM_ROUTE_PARAM, options?.route_param ?? "id"),
    SetMetadata(PERM_USER_PROPERTY, options?.user_property ?? "id"),
    SetMetadata(PERM_ADMIN_OVERRIDE, options?.allow_admins ?? true),
    UseGuards(OwnerPermissionGuard),
  );
}
