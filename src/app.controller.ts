import { Controller, Get, Render, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CategoriesService } from './categories/categories.service';
import { PostsService } from './posts/posts.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly _categoriesService: CategoriesService,
    private readonly _postsService: PostsService,
  ) {}

  @Get('signup')
  @Render('signup/signup')
  async signUp() {
    return {};
  }

  @Get('login')
  @Render('login/login')
  async login() {
    return {};
  }

  @Get()
  @Render('categories/index')
  async main() {
    const categories = await this._categoriesService.findAll();
    return { categories };
  }

  @Get('about')
  @Render('about/about')
  async getAbout() {
    return {};
  }

  @Get('posts')
  @Render('posts/list')
  async findAll() {
    const posts = await this._postsService.findAll();
    return { posts };
  }

  @Get('create')
  @Render('posts/create')
  async handleCreate() {
    return {};
  }

  @Get('edit/:id')
  @Render('posts/edit')
  async handleEdit(@Param('id') id: number) {
    const post = await this._postsService.findOne(id);
    return { post };
  }

  @Get('delete/:id')
  @Render('posts/delete')
  async handleDelete(@Param('id') id: number) {
    const post = await this._postsService.findOne(id);
    return { post };
  }
}
