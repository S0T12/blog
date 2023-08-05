import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AdminGuard } from './guards/admin.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly _postsService: PostsService) {}

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this._postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this._postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const post = this._postsService.findOne(id);
    return {
      project: post,
    };
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this._postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this._postsService.remove(id);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this._postsService.findByCategory(category);
  }
}
