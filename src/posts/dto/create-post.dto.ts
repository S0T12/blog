import { PartialType } from '@nestjs/mapped-types';
import { PostEntity } from '../entities/post.entity';

export class CreatePostDto extends PartialType(PostEntity) {}
