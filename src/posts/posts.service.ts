import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly _postEntity: Repository<PostEntity>,
    private readonly _usersService: UsersService,
    private readonly _categoriesService: CategoriesService,
  ) {}

  async create(createPostDto: CreatePostDto, author: string) {
    const post = this._postEntity.create(
      createPostDto as unknown as DeepPartial<PostEntity>,
    );

    const { category } = createPostDto;

    const user = await this._usersService.findByUsername(author);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    post.author = user;

    const categoryEntity = await this._categoriesService.findOneByName(
      category.toString(),
    );

    if (!categoryEntity) {
      throw new NotFoundException('Category not found');
    }
    post.category = categoryEntity;

    post.likes = [];

    return this._postEntity.save(post);
  }

  async findAll() {
    return await this._postEntity
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'commentAuthor')
      .leftJoinAndSelect('comments.replies', 'replies')
      .leftJoinAndSelect('replies.author', 'replyAuthor')
      .leftJoinAndSelect('post.author', 'author')
      .select([
        'post.id',
        'post.title',
        'post.text',
        'post.createdAt',
        'author.username',
        'comments',
        'commentAuthor.username',
        'replies',
        'replyAuthor.username',
        'post.likes',
      ])
      .getMany();
  }

  async findOne(id: number) {
    const post = await this._postEntity.findOne({
      where: { id },
      relations: [
        'author',
        'category',
        'comments',
        'comments.author',
        'comments.replies',
        'comments.replies.author',
        'likes',
      ],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findOneWithRelations(id: number, relations: string[]) {
    return this._postEntity.findOne({
      where: { id },
      relations,
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this._postEntity.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    Object.assign(post, updatePostDto);

    return this._postEntity.save(post);
  }

  remove(id: number) {
    return this._postEntity.delete(id);
  }

  async findByCategory(category: string) {
    const categoryEntity = await this._categoriesService.findOneByName(
      category,
    );

    if (!categoryEntity) {
      throw new NotFoundException('Category not found');
    }

    return await this._postEntity
      .createQueryBuilder('post')
      .innerJoin('post.category', 'category')
      .where('category.id = :categoryId', { categoryId: categoryEntity.id })
      .getMany();
  }

  async likePost(id: number, username: string) {
    const post = await this._postEntity.findOne({
      where: { id },
      relations: ['likes'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const likedByUser = post.likes.find((user) => user.username === username);

    if (likedByUser) {
      throw new UnauthorizedException('You have already liked this post');
    }

    const user = await this._usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    post.likes.push(user);

    return this._postEntity.save(post);
  }

  async unlikePost(id: number, username: string) {
    const post = await this._postEntity.findOne({
      where: { id },
      relations: ['likes'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const likedByUserIndex = post.likes.findIndex(
      (user) => user.username === username,
    );

    if (likedByUserIndex === -1) {
      throw new UnauthorizedException('You have not liked this post');
    }

    post.likes.splice(likedByUserIndex, 1);

    return this._postEntity.save(post);
  }
}
