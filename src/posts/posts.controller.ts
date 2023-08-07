import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Render,
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
  async create(@Body() createPostDto: CreatePostDto) {
    return await this._postsService.create(createPostDto);
  }

  @Get()
  async findAll() {
    const posts = await this._postsService.findAll();
    return { posts };
  }

  @Get(':id')
  @Render('posts/post')
  async findOne(@Param('id') id: number) {
    try {
      const post = await this._postsService.findOne(id);
      return { post };
    } catch (error) {
      return { post: error };
    }
  }

  @UseGuards(AdminGuard)
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
