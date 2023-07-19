import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
