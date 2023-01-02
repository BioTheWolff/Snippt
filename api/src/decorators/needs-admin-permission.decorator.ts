import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminPermissionGuard } from 'src/auth/guards/permissions/admin-permission.guard';

export function NeedsAdminPermission() {
  return applyDecorators(
    UseGuards(AdminPermissionGuard),
  );
}
