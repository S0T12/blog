import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  text: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.posts)
  author: UserEntity;

  @Column({ type: 'text', nullable: true })
  code: string[];

  @Column({ type: 'text', nullable: true })
  images: string[];

  @Column({ type: 'text', array: true, default: [] })
  likes: string[];

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.posts,
    { onDelete: 'CASCADE' },
  )
  category: CategoryEntity;

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.post)
  comments: CommentEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
