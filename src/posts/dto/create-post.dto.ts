import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsNumber()
  author: number;

  @IsString()
  code: string;

  @IsArray()
  images: string[];

  @IsArray()
  category: [];
}
