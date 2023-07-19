import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService, UsersService],
  exports: [TypeOrmModule],
})
export class PostsModule {}
