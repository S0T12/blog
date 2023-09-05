import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';

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
      createPostDto as DeepPartial<PostEntity>,
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

    return this._postEntity.save(post);
  }

  async findAll() {
    return await this._postEntity.find({ relations: ['author', 'category'] });
  }

  async findOne(id: number) {
    return await this._postEntity.findOne({
      where: { id },
      relations: ['author', 'category'],
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
}
