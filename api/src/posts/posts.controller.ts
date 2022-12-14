import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException, ParseIntPipe, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RequestWithUser } from '../types/request-with-user.type';
import { NeedsAuthorPermission } from '../decorators/needs-author-permission.decorator';
import { Public } from '../decorators/public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Req() req: RequestWithUser, @Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(req.user, createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Public()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @Patch(':id')
  @NeedsAuthorPermission()
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
