import { Controller, Get, Render, Param, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CategoriesService } from './categories/categories.service';
import { PostsService } from './posts/posts.service';
import { AdminGuard } from './shared/guards/admin.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly _categoriesService: CategoriesService,
    private readonly _postsService: PostsService,
    private readonly _usersService: UsersService,
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
  async main(@Req() req) {
    const categories = await this._categoriesService.findAll();
    const authToken = req.cookies.token;
    const username = req.user?.username;
    return { categories, authToken, username };
  }

  @Get('about')
  @Render('about/about')
  async getAbout() {
    return {};
  }

  @Get('articles')
  @Render('articles/list')
  async getArticles() {
    const articles = await this._postsService.findByCategory('articles');
    return { articles };
  }

  @Get('articles/:id')
  @Render('articles/article')
  async getArticle(@Param('id') id: number) {
    try {
      const article = await this._postsService.findOne(id);
      return { article };
    } catch (error) {
      return { article: error };
    }
  }

  @Get('projects')
  @Render('projects/list')
  async getProjects() {
    const projects = await this._postsService.findByCategory('projects');
    return { projects };
  }

  @Get('projects/:id')
  @Render('projects/project')
  async getProject(@Param('id') id: number) {
    try {
      const project = await this._postsService.findOne(id);
      return { project };
    } catch (error) {
      return { project: error };
    }
  }

  @UseGuards(AdminGuard)
  @Get('create')
  @Render('posts/create')
  async handleCreate() {
    return {};
  }

  @UseGuards(AdminGuard)
  @Get('edit/:id')
  @Render('posts/edit')
  async handleEdit(@Param('id') id: number) {
    const post = await this._postsService.findOne(id);
    return { post };
  }

  @UseGuards(AdminGuard)
  @Get('delete/:id')
  @Render('posts/delete')
  async handleDelete(@Param('id') id: number) {
    const post = await this._postsService.findOne(id);
    return { post };
  }

  @Get('admin')
  @Render('admin/admin')
  @UseGuards(AdminGuard)
  async showAdminPage() {
    return {};
  }
}
