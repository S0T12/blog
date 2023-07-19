import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CategoryEntity } from '../categories/entities/category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly _postEntity: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this._postEntity.create(
      createPostDto as DeepPartial<PostEntity>,
    );

    const { author, category } = createPostDto;

    const user = await this._userRepository.findOne({
      where: { id: createPostDto.author },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    post.author = user;

    const categoryEntity = await this._categoryRepository.findOne({
      where: { name: category.toString() },
    });

    if (!categoryEntity) {
      throw new NotFoundException('Category not found');
    }
    post.category = categoryEntity;

    return this._postEntity.save(post);
  }

  findAll() {
    return this._postEntity.find();
  }

  findOne(id: number) {
    return this._postEntity.findOne({ where: { id } });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this._postEntity.update(id, updatePostDto);
  }

  remove(id: number) {
    return this._postEntity.delete(id);
  }
}
