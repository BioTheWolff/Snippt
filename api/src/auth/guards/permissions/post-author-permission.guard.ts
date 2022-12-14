import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { responseMessages } from '../../../response-messages';
import { PERM_ADMIN_OVERRIDE, PERM_USER_PROPERTY } from '../../../decorators/permission.decorator.util';
import { PostsService } from '../../../posts/posts.service';

@Injectable()
export class PostAuthorPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly postsService: PostsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user_property = this.reflector.get<string>(PERM_USER_PROPERTY, context.getHandler());
    const admin_override = this.reflector.get<boolean>(PERM_ADMIN_OVERRIDE, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (admin_override && user.is_admin()) return true;

    const post = await this.postsService.findOne(request.params['id']);

    // TODO: refactor into another guard
    if (!post) {
      throw new BadRequestException(responseMessages.POST_NOT_FOUND);
    }

    if (String(user[user_property]) !== String(post.author[user_property])) this.refuse();
    return true;
  }

  refuse() {
    throw new ForbiddenException(responseMessages.TARGET_NOT_SELF);
  }
}
