import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly _postEntity: Repository<PostEntity>,
  ) {}
  create(createPostDto: CreatePostDto) {
    console.log('createPostDtoService', CreatePostDto);
    return this._postEntity.save(createPostDto);
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
