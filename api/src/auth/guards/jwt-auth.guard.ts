import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_BYPASSING_JWT_AUTH } from '../../decorators/bypass-jwt-auth.decorator';
import { IS_PUBLIC } from '../../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
            context.getHandler(),
            context.getClass(),
        ]);
        const isBypassing = this.reflector.getAllAndOverride<boolean>(IS_BYPASSING_JWT_AUTH, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic || isBypassing) {
            return true;
        }

        return super.canActivate(context);
    }
}
