import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  text: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.comments, {
    eager: true,
  })
  @JoinColumn({ name: 'authorId', referencedColumnName: 'id' })
  author: UserEntity;

  @ManyToOne(() => PostEntity, (post: PostEntity) => post.comments)
  post: PostEntity;

  @OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.parentComment,
  )
  replies: CommentEntity[];

  @ManyToOne(() => CommentEntity, (comment: CommentEntity) => comment.replies, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentCommentId', referencedColumnName: 'id' })
  parentComment: CommentEntity;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  likes: UserEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
