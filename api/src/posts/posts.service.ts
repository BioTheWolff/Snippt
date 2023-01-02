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
    @InjectRepository(Post) private readonly repository: Repository<Post>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async create(user: User, createPostDto: CreatePostDto) {
    let post = this.repository.create(createPostDto);
    post.author = user;
    return await this.repository.save(post);
  }

  async createAnswer(user: User, postId: number, createPostDto: CreatePostDto) {
    const parent = await this.repository.findOneBy({id: postId});
    if (!parent || parent.deleted) throw new BadRequestException(responseMessages.PARENT_NOT_FOUND);

    let post = this.repository.create(createPostDto);
    post.author = user;
    post.parent = parent;
    return await this.repository.save(post);
  }

  async findAll() {
    return await this.repository.find({
      order: {
        created_at: 'DESC',
      },
      relations: {
        author: true,
        answers: true,
      }
    });
  }

  async findByPage(limit: number, page: number) {
    return await this.repository.find({
      order: {
        created_at: 'DESC',
      },
      relations: {
        author: true,
        answers: true,
      },
      skip: (page-1)*limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      relations: {
        author: true,
        likes: true,
        dislikes: true,
        answers: true,
        parent: true,
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

  // likes
  async like(user: User, id: number) {
    const post = await this.findOne(id);

    if (!post) {
      throw new BadRequestException(responseMessages.POST_NOT_FOUND);
    }

    user.likePost(post);
    await this.usersRepository.save(user);

    return { "status": "OK" };
  }

  async dislike(user: User, id: number) {
    const post = await this.findOne(id);

    if (!post) {
      throw new BadRequestException(responseMessages.POST_NOT_FOUND);
    }

    user.dislikePost(post);
    await this.usersRepository.save(user);

    return { "status": "OK" };
  }

  async neutral(user: User, id: number) {
    const post = await this.findOne(id);

    if (!post) {
      throw new BadRequestException(responseMessages.POST_NOT_FOUND);
    }

    user.backToNeutralForPost(post);
    await this.usersRepository.save(user);

    return { "status": "OK" };
  }
}
