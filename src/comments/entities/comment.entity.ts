import {
  Column,
  CreateDateColumn,
  Entity,
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

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.comments)
  author: UserEntity;

  @ManyToOne(() => PostEntity, (post: PostEntity) => post.comments)
  post: PostEntity;

  @OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.parentComment,
    {
      nullable: true,
    },
  )
  replies: CommentEntity[];

  @ManyToOne(() => CommentEntity, (comment: CommentEntity) => comment.replies, {
    nullable: true,
  })
  parentComment: CommentEntity;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
