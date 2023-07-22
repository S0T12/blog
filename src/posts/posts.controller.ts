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
    console.log('createPostDto', createPostDto);
    return this._postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this._postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this._postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._postsService.remove(+id);
  }
}
