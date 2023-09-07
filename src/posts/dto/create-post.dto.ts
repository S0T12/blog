import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsArray()
  code: string[];

  @IsArray()
  images: string[];

  @IsArray()
  category: [];

  @IsOptional()
  @IsNumber()
  imagePosition: number;

  @IsOptional()
  @IsNumber()
  codePosition: number;

  @IsArray()
  @IsOptional()
  likes: string[];
}
