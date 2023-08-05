import { Controller, Get, Render, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('layouts/main')
  async getMain() {
    return {};
  }

  @Get('about')
  @Render('about/about')
  async getAbout() {
    return {};
  }

  @Get('projects')
  @Render('projects/list')
  async getList() {
    return {};
  }

  @Get('projects/:id')
  @Render('projects/project')
  async GetProject() {
    return {};
  }

  @Get('create')
  @Render('projects/create')
  async handleCreate() {
    return {};
  }

  @Get('edit/:id')
  @Render('projects/edit')
  async handleEdit() {
    return {};
  }

  @Get('delete/:id')
  @Render('projects/delete')
  async handleDelete() {
    return {};
  }

  @Delete('posts/:id/delete')
  async deletePost() {
    return 'Post deleted successfully';
  }
}
