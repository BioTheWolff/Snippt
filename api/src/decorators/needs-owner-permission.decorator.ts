import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnerPermissionGuard } from '../auth/guards/permissions/owner-permission.guard';

export const PERM_ROUTE_PARAM = 'PERM_ROUTE_PARAM';
export const PERM_USER_PROPERTY = 'PERM_USER_PROPERTY';

export function NeedsOwnerPermission(route_param: string = "id", user_property: string = "id") {
  return applyDecorators(
    SetMetadata(PERM_ROUTE_PARAM, route_param),
    SetMetadata(PERM_USER_PROPERTY, user_property),
    UseGuards(OwnerPermissionGuard),
  );
}
