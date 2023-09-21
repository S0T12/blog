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

  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  imagePosition: number;

  @IsOptional()
  @IsNumber()
  codePosition: number;

  @IsOptional()
  @IsNumber()
  likes: number;
}
