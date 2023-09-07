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
    const authToken = this._authService.getAuthTokenFromCookie(cookie);
    try {
      const payload = this._jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });
      return await this._postsService.create(createPostDto, payload.username);
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
    return await this._postsService.findOne(id);
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
      return this._postsService.update(id, updatePostDto);
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
    return this._postsService.findByCategory(category);
  }
}
