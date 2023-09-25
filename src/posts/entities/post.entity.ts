import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @ManyToMany(() => UserEntity)
  @JoinTable()
  likes: UserEntity[];

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.posts,
    {
      onDelete: 'CASCADE',
    },
  )
  category: CategoryEntity;

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.post)
  comments: CommentEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
