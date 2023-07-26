import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { CategoriesService } from './categories/categories.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @Render('layouts/main')
  async getMain() {
    const categories = await this.categoriesService.findAll();
    return { categories };
  }

  @Get('/about')
  @Render('about/about')
  async getAbout() {
    console.log('about');
  }

  @Get('/projects')
  @Render('projects/project')
  async getProject() {
    console.log('projects');
  }
}
