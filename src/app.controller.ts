import { Controller, Get, Render } from '@nestjs/common';
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

  @Get()
  @Render('layouts/main')
  async getMain() {
    const categories = await this._categoriesService.findAll();
    return { categories };
  }

  @Get('/about')
  @Render('about/about')
  async getAbout() {
    console.log('about');
  }

  @Get('/projects')
  @Render('projects/list')
  async getList() {
    const projects = await this._postsService.findByCategory('Projects');
    return { projects };
  }

  @Get('projects/:id')
  @Render('projects/project')
  async GetPorject() {
    console.log('nothing!');
  }
}
