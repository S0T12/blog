import { Controller, Get, Render, Param, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CategoriesService } from './categories/categories.service';
import { PostsService } from './posts/posts.service';
import { AdminGuard } from './shared/guards/admin.guard';
import { UsersService } from './users/users.service';
import { CommentsService } from './comments/comments.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
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
    const categories = await this.categoriesService.findAll();
    const authToken = req.cookies.token;
    const username = req.user?.username;
    return { categories, authToken, username };
  }

  @Get('about')
  @Render('about/about')
  async getAbout() {
    return {};
  }

  @Get('posts')
  @Render('posts/list')
  async getPosts() {
    const posts = await this.postsService.findAll();
    return { posts };
  }

  @Get('posts/:id')
  @Render('posts/post')
  async getPost(@Param('id') id: number) {
    try {
      const post = await this.postsService.findOne(id);
      const comments = await this.commentsService.findByPostId(id);
      return { post, comments };
    } catch (error) {
      return { post: error };
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
    const post = await this.postsService.findOne(id);
    return { post };
  }

  @UseGuards(AdminGuard)
  @Get('delete/:id')
  @Render('posts/delete')
  async handleDelete(@Param('id') id: number) {
    const post = await this.postsService.findOne(id);
    return { post };
  }

  @Get('admin')
  @Render('admin/admin')
  @UseGuards(AdminGuard)
  async showAdminPage() {
    return {};
  }
}
