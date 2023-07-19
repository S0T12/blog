import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsNumber()
  author: number;
}
