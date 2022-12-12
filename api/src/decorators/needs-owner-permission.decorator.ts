import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnerPermissionGuard } from '../auth/guards/permissions/owner-permission.guard';

export const PERM_ROUTE_PARAM = 'PERM_ROUTE_PARAM';
export const PERM_USER_PROPERTY = 'PERM_USER_PROPERTY';
export const PERM_ADMIN_OVERRIDE = 'PERM_ADMIN_OVERRIDE'

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
