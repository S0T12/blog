import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly _commentsService: CommentsService,
    private readonly _authService: AuthService,
    private readonly _jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Headers('cookie') cookie: string,
  ) {
    const authToken = this._authService.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });

      return await this._commentsService.create(createCommentDto, cookie);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':parentId/replies')
  async createReplyComment(
    @Param('parentId') parentId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Headers('cookie') cookie: string,
  ) {
    const authToken = this._authService.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });

      return await this._commentsService.create(createCommentDto, cookie);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get()
  findAll() {
    return this._commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._commentsService.findOne(+id);
  }

  @Get('post/:postId')
  findByPostId(@Param('postId') postId: number) {
    return this._commentsService.findByPostId(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Headers('cookie') cookie: string,
  ) {
    console.log(`request is here`);

    const authToken = this._authService.getAuthTokenFromCookie(cookie);
    const { username } = this._jwtService.decode(authToken) as {
      username: string;
    };
    const comment = await this._commentsService.update(
      +id,
      updateCommentDto,
      username,
    );
    const updatedComment = {
      ...comment,
      author: comment.author.username,
    };
    return updatedComment;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._commentsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeComment(
    @Param('id') id: string,
    @Headers('cookie') cookie: string,
  ) {
    const authToken = this._authService.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verifyAsync(authToken, {
        secret: process.env.SECRET,
      });

      const { username } = await payload;

      const comment = await this._commentsService.likeComment(+id, username);
      const likes = comment.likes;
      return { likes };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unlike')
  async unlikeComment(
    @Param('id') id: string,
    @Headers('cookie') cookie: string,
  ) {
    const authToken = this._authService.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });

      const { username } = payload;

      const comment = await this._commentsService.unlikeComment(+id, username);
      const likes = comment.likes;
      return { likes };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
