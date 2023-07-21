import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UsersService } from '../users/users.service';
import { CategoryEntity } from '../categories/entities/category.entity';
import { UsersModule } from '../users/users.module';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, CategoryEntity, UserEntity]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, UsersService],
})
export class PostsModule {}
