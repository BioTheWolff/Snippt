import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException, ParseIntPipe, UseInterceptors, ClassSerializerInterceptor, Query, DefaultValuePipe, ValidationPipe, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, languages } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RequestWithUser } from '../types/request-with-user.type';
import { NeedsAuthorPermission } from '../decorators/needs-author-permission.decorator';
import { Public } from '../decorators/public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get('languages')
  languages() {
    return languages;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Req() req: RequestWithUser, @Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(req.user, createPostDto);
  }

  @Public()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    if (limit > 0) {
      if (page < 1) throw new BadRequestException();
      return await this.postsService.findByPage(limit, page);
    } else {
      return await this.postsService.findAll();
    }
  }

  @Public()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOnePublic(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  // TODO: findOneDeleted with author permission

  @Patch(':id')
  @NeedsAuthorPermission()
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @NeedsAuthorPermission()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }


  // Likes
  @Post(':id/like')
  async like(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    return await this.postsService.like(req.user, id);
  }

  @Post(':id/dislike')
  async dislike(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    return await this.postsService.dislike(req.user, id);
  }

  @Post(':id/neutral')
  async neutral(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    return await this.postsService.neutral(req.user, id);
  }
}
