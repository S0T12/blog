import { IsArray, IsString } from 'class-validator';
import { PostEntity } from '../../posts/entities/post.entity';

enum roles {
  ADMIN = 'admin',
  USER = 'user',
}

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  role: roles;

  @IsArray()
  posts: PostEntity[];
}
