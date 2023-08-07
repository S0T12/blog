import { IsArray, IsString } from 'class-validator';
import { PostEntity } from '../../posts/entities/post.entity';
import { IsRole } from '../validators/role.validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsRole({ message: 'Role must be either "user" or "admin"' })
  role: string;

  @IsArray()
  posts: PostEntity[];
}
