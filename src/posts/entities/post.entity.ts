import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  author: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.post, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity;

  @CreateDateColumn()
  createdAt: Date;
}
