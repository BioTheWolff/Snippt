import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminPermissionGuard } from '../auth/guards/permissions/admin-permission.guard';

export function NeedsAdminPermission() {
  return applyDecorators(
    UseGuards(AdminPermissionGuard),
  );
}
