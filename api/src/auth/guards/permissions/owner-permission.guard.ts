import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { responseMessages } from '../../../response-messages';
import { PERM_ADMIN_OVERRIDE, PERM_ROUTE_PARAM, PERM_USER_PROPERTY } from '../../../decorators/needs-owner-permission.decorator';

@Injectable()
export class OwnerPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const route_param = this.reflector.get<string>(PERM_ROUTE_PARAM, context.getHandler());
    const user_property = this.reflector.get<string>(PERM_USER_PROPERTY, context.getHandler());
    const admin_override = this.reflector.get<boolean>(PERM_ADMIN_OVERRIDE, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (admin_override && user.is_admin()) return true;

    if (String(user[user_property]) === String(request.params[route_param])) {
      return true;
    } else {
      this.refuse();
    }
  }

  refuse() {
    throw new ForbiddenException(responseMessages.TARGET_NOT_SELF);
  }
}
