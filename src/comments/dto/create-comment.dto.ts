import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  text: string;

  @IsNumber()
  postId: number;

  @IsNumber()
  @IsOptional()
  parentId: number;
}
