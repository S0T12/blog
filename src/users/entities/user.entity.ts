import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum roles {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column()
  role: roles;
}
