import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly _postEntity: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this._postEntity.create(createPostDto);
    const user = await this._userRepository.findOne({
      where: { id: createPostDto.author },
    });
    post.author = user.id;
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
