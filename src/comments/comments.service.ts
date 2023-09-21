import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { Repository, Not, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly _commentEntity: Repository<CommentEntity>,
    private readonly _postService: PostsService,
    private readonly _userService: UsersService,
    private readonly _authService: AuthService,
    private readonly _jwtService: JwtService,
  ) {}

  async create(createCommentDto: CreateCommentDto, cookie: string) {
    const authToken = this._authService.getAuthTokenFromCookie(cookie);

    try {
      const payload = this._jwtService.verify(authToken, {
        secret: process.env.SECRET,
      });

      const { postId, parentId, ...commentData } = createCommentDto;

      if (parentId) {
        const parentComment = await this._commentEntity.findOne({
          where: { id: parentId },
          relations: ['post'],
        });

        if (!parentComment) {
          throw new NotFoundException('Parent comment not found');
        }

        const post = parentComment.post;

        if (!post) {
          throw new NotFoundException('Post not found');
        }

        const author = await this._userService.findByUsername(payload.username);

        if (!author) {
          throw new NotFoundException('Author not found');
        }

        const comment = this._commentEntity.create(commentData);
        comment.post = post;
        comment.author = author;
        comment.parentComment = parentComment;

        return this._commentEntity.save(comment);
      } else {
        const post = await this._postService.findOneWithRelations(postId, [
          'comments',
        ]);

        if (!post) {
          throw new NotFoundException('Post not found');
        }

        const author = await this._userService.findByUsername(payload.username);

        if (!author) {
          throw new NotFoundException('Author not found');
        }

        const comment = this._commentEntity.create(commentData);
        comment.post = post;
        comment.author = author;

        return this._commentEntity.save(comment);
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async findAll() {
    const topLevelComments: CommentEntity[] = [];

    const allComments = await this._commentEntity.find({
      relations: ['author', 'replies', 'replies.author', 'parentComment'],
      order: { createdAt: 'DESC' },
    });

    allComments.forEach((comment) => {
      if (!comment.parentComment && !comment.isApproved) {
        topLevelComments.push(comment);
      }
    });

    const commentsWithUsernames = topLevelComments.map((comment) => ({
      id: comment.id,
      text: comment.text,
      author: comment.author.username,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      likes: comment.likes,
      replies: comment.replies
        .filter((reply) => !reply.isApproved)
        .map((reply) => ({
          id: reply.id,
          text: reply.text,
          author: reply.author.username,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          likes: reply.likes,
        })),
    }));

    return commentsWithUsernames;
  }

  async findOne(id: number) {
    const comment = await this._commentEntity.findOne({
      where: { id },
      relations: ['author', 'replies', 'replies.author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return {
      ...comment,
      author: comment.author.username,
      likes: comment.likes,
      replies: comment.replies
        .filter((reply) => !reply.isApproved)
        .map((reply) => ({
          ...reply,
          author: reply.author.username,
          likes: reply.likes,
        })),
    };
  }

  async findByPostId(postId: number) {
    const topLevelComments: CommentEntity[] = [];

    const allComments = await this._commentEntity.find({
      where: { post: { id: postId } },
      relations: ['author', 'replies', 'replies.author', 'parentComment'],
      order: { createdAt: 'DESC' },
    });

    allComments.forEach((comment) => {
      if (!comment.parentComment && !comment.isApproved) {
        topLevelComments.push(comment);
      }
    });

    const commentsWithUsernames = topLevelComments.map((comment) => ({
      id: comment.id,
      text: comment.text,
      author: comment.author.username,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      replies: comment.replies
        .filter((reply) => !reply.isApproved)
        .map((reply) => ({
          id: reply.id,
          text: reply.text,
          author: reply.author.username,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
        })),
    }));

    return commentsWithUsernames;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    username: string,
  ) {
    const comment = await this._commentEntity.findOne({
      where: { id, isApproved: false },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.username !== username) {
      throw new UnauthorizedException(
        'You are not authorized to update this comment',
      );
    }

    comment.text = updateCommentDto.text;
    return this._commentEntity.save(comment);
  }

  async remove(id: number) {
    const comment = await this._commentEntity.findOne({
      where: { id },
      relations: ['replies'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.replies.length > 0) {
      comment.isApproved = true;
      await this._commentEntity.save(comment);
      return;
    }

    return this._commentEntity.remove(comment);
  }

  async likeComment(id: number, username: string) {
    const comment = await this._commentEntity
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.likes', 'like')
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const likedByUser = comment.likes.find(
      (like) => like.username === username,
    );

    if (likedByUser) {
      throw new UnauthorizedException('You have already liked this comment');
    }

    const user = await this._userService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    comment.likes.push(user);
    await this._commentEntity.save(comment);

    const updatedComment = await this._commentEntity
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.likes', 'like')
      .where('comment.id = :id', { id: comment.id })
      .getOne();

    if (!updatedComment) {
      throw new NotFoundException('Comment not found');
    }

    const likesCount = updatedComment.likes.length;
    return { likes: likesCount };
  }

  async unlikeComment(id: number, username: string) {
    const comment = await this._commentEntity
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.likes', 'like')
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const likedByUser = comment.likes.find(
      (like) => like.username === username,
    );

    if (!likedByUser) {
      throw new UnauthorizedException('You have not liked this comment');
    }

    comment.likes = comment.likes.filter((like) => like.username !== username);
    await this._commentEntity.save(comment);

    const likesCount = comment.likes.length;
    return { likes: likesCount };
  }
}
