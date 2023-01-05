import { Controller, Get, Post, Body, Patch, Param, Delete, Req, NotFoundException, ParseIntPipe, UseInterceptors, ClassSerializerInterceptor, Query, DefaultValuePipe, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, languages } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RequestWithUser } from '../types/request-with-user.type';
import { NeedsAuthorPermission } from '../decorators/needs-author-permission.decorator';
import { Public } from '../decorators/public.decorator';
import { NeedsAdminPermission } from '../decorators/needs-admin-permission.decorator';
import { ApiExcludeEndpoint, ApiNotFoundResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { ApiResponseForbidden, ApiResponseUnauthorized, ApiResponseValidationError } from '../decorators/api-responses.decorator';
import { JsonStatusResponse, PostUpdateResponse } from '../types/api-responses.type';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get('languages')
  @ApiTags('post')
  @ApiOperation({ summary: 'Get the list of allowed languages for posts' })
  @ApiResponse({
    status: 200,
    description: "The list of allowed languages",
  })
  languages() {
    return languages;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiTags('post')
  @ApiOperation({ summary: "Create a new post" })
  @ApiResponse({
    status: 201,
    description: "The created post",
    type: PostEntity,
  })
  @ApiResponseValidationError()
  @ApiResponseUnauthorized()
  async create(@Req() req: RequestWithUser, @Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(req.user, createPostDto);
  }

  @Public()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiTags('post')
  @ApiOperation({ 
    summary: "Get the list of posts",
    description: "if limit is not specified or under 1, all the posts are returned. else, the X first posts are fetched, using the limit and page query parameters"
  })
  @ApiQuery({ 
    name: "limit",
    required: false,
    description: "The number of posts to fetch at once",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "The current page of X posts to fetch"
  })
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

  @Get('/admin')
  @NeedsAdminPermission()
  @ApiExcludeEndpoint()
  async findAllAdmin() {
    return await this.postsService.findAllAdmin();
  }

  @Public()
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiTags('post')
  @ApiOperation({ summary: "Get a single post" })
  @ApiResponse({
    status: 200,
    description: "Returns the found post",
    type: PostEntity,
  })
  @ApiNotFoundResponse({ description: "If no post with this id was found" })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOnePublic(id);
    if (!post) throw new NotFoundException();
    return post;
  }
  
  @Public()
  @Get(':id/chain')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiTags('post chains')
  @ApiOperation({ 
    summary: "Get a post's chain",
    description: "The post's chain is all the posts, in order, leading up to this answer. If the post is standalone and was not an answer, the chain will only feature the requested post"
  })
  @ApiResponse({
    status: 200,
    description: "Returns the chain, with the initial post being the first in the array",
  })
  @ApiNotFoundResponse({ description: "If no post with this id was found" })
  async findOneChain(@Param('id', ParseIntPipe) id: number) {
    const chain = await this.postsService.findOneChain(id);
    if (!chain) throw new NotFoundException();
    return chain;
  }

  @Post(':id/answer')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiTags('post chains')
  @ApiOperation({ summary: "Create a new answer to a post" })
  @ApiResponse({
    status: 201,
    description: "The created post",
    type: PostEntity,
  })
  @ApiResponseValidationError()
  async createAnswer(
    @Req() req: RequestWithUser, 
    @Param('id', ParseIntPipe) postId: number,
    @Body() createPostDto: CreatePostDto
  ) {
    return await this.postsService.createAnswer(req.user, postId, createPostDto);
  }

  // TODO: findOneDeleted with author permission

  @Patch(':id')
  @NeedsAuthorPermission()
  @ApiTags('post')
  @ApiOperation({ summary: "Update the post - requires ownership" })
  @ApiResponse({
    status: 200,
    description: "The post's id, alongside the updated fields",
    type: PostUpdateResponse
  })
  @ApiResponseValidationError()
  @ApiResponseUnauthorized()
  @ApiResponseForbidden()
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @NeedsAuthorPermission()
  @ApiTags('post')
  @ApiOperation({ summary: "Delete the post - requires ownership" })
  @ApiResponse({
    status: 200,
    type: JsonStatusResponse
  })
  @ApiResponseUnauthorized()
  @ApiResponseForbidden()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }


  // Likes
  @Post(':id/like')
  @ApiTags('post interactions')
  @ApiOperation({ summary: "Like the post" })
  @ApiResponse({
    status: 200,
    type: JsonStatusResponse
  })
  @ApiResponseUnauthorized()
  async like(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    return await this.postsService.like(req.user, id);
  }

  @Post(':id/dislike')
  @ApiTags('post interactions')
  @ApiOperation({ summary: "Dislike the post" })
  @ApiResponse({
    status: 200,
    type: JsonStatusResponse
  })
  @ApiResponseUnauthorized()
  async dislike(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    return await this.postsService.dislike(req.user, id);
  }

  @Post(':id/neutral')
  @ApiTags('post interactions')
  @ApiOperation({ summary: "Remove your reaction to the post" })
  @ApiResponse({
    status: 200,
    type: JsonStatusResponse
  })
  @ApiResponseUnauthorized()
  async neutral(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    return await this.postsService.neutral(req.user, id);
  }
}
