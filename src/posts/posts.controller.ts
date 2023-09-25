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
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AdminGuard } from '../shared/guards/admin.guard';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly _postsService: PostsService,
    private readonly _authService: AuthService,
    private readonly _jwtService: JwtService,
  ) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Headers('cookie') cookie: string,
  ) {
    console.log(cookie);
    const authToken = this._authService.getAuthTokenFromCookie(cookie);
    try {
      const payload = this._jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });
      const post = await this._postsService.create(
        createPostDto,
        payload.username,
      );
      return { post };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get()
  async findAll() {
    const posts = await this._postsService.findAll();
    return { posts };
  }

  @Get(':id')
  @Render('posts/post')
  async findOne(@Param('id') id: number) {
    const post = await this._postsService.findOne(id);
    return { post };
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Headers('cookie') cookie: string,
  ) {
    const authToken = this._authService.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verifyAsync(authToken, {
        secret: process.env.SECRET,
      });
      const post = this._postsService.update(id, updatePostDto);
      return { post };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this._postsService.remove(id);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    const posts = this._postsService.findByCategory(category);
    return { posts };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likePost(@Param('id') id: number, @Headers('cookie') cookie: string) {
    const authToken = this._authService.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });
      console.log();

      const { username } = payload;

      const post = await this._postsService.likePost(id, username);

      const likes = post.likes.length;

      return { likes };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Failed to like the post');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unlike')
  async unlikePost(@Param('id') id: number, @Headers('cookie') cookie: string) {
    const authToken = this._authService.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });

      const { username } = payload;

      const post = await this._postsService.unlikePost(id, username);

      const likes = post.likes.length;

      return { likes };
    } catch (error) {
      throw new UnauthorizedException('Failed to unlike the post');
    }
  }
}
