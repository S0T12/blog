import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from '../../posts/entities/post.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => PostEntity, (post) => post.category)
  post: PostEntity;
}
