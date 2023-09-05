import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', default: 'user' })
  role: string;

  @OneToMany(() => PostEntity, (post: PostEntity) => post.author)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.author)
  comments: CommentEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
