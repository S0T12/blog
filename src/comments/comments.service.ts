import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly _commentEntity: Repository<CommentEntity>,
    private readonly _postService: PostsService,
    private readonly _userService: UsersService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { postId, username, ...commentData } = createCommentDto;
    const post = await this._postService.findOneWithRelations(postId, [
      'comments',
    ]);
    const author = await this._userService.findByUsername(username);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const comment = this._commentEntity.create(commentData);
    comment.post = post;
    comment.author = author;

    return this._commentEntity.save(comment);
  }

  async createReplyComment(
    parentId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const { postId, username, ...commentData } = createCommentDto;

    const parentComment = await this._commentEntity.findOne({
      where: { id: parentId },
      relations: ['post'],
    });

    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    const post = parentComment.post;
    const author = await this._userService.findByUsername(username);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const comment = this._commentEntity.create(commentData);
    comment.post = post;
    comment.author = author;
    comment.parentComment = parentComment;

    return this._commentEntity.save(comment);
  }

  async findAll() {
    const comments = await this._commentEntity.find({
      relations: ['author', 'replies', 'replies.author'],
    });

    return comments.map((comment) => ({
      ...comment,
      author: comment.author.username,
      replies: comment.replies.map((reply) => ({
        ...reply,
        author: reply.author.username,
      })),
    }));
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
      replies: comment.replies.map((reply) => ({
        ...reply,
        author: reply.author.username,
      })),
    };
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this._commentEntity.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this._commentEntity.delete(id);
  }
}
