import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { responseMessages } from '../response-messages';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>
  ) {}

  async create(user: User, createPostDto: CreatePostDto) {
    let post = this.repository.create(createPostDto);
    post.author = user;
    return await this.repository.save(post);
  }

  findAll() {
    return `This action returns all posts`;
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      relations: {
        author: true
      },
      where: {id: id}
    });
  }

  async findOnePublic(id: number) {
    const post = await this.findOne(id);

    if (!post) return;

    if (post.deleted) {
      return {
        title: post.title,
        deleted: true,
      }
    } else {
      return post;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.repository.findOneBy({ id: id });

    if (!post) {
      throw new BadRequestException(responseMessages.POST_NOT_FOUND);
    }

    await this.repository.update({id: id}, updatePostDto);
    return updatePostDto;
  }

  async remove(id: number) {
    const post = await this.repository.findOneBy({ id: id });

    if (!post) {
      throw new BadRequestException(responseMessages.POST_NOT_FOUND);
    }

    await this.repository.update({id: id}, {deleted: true});
    return "OK";
  }
}
