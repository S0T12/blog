import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserExistsGuard } from './guards/user-exists.guard';
import { UserExistsFilter } from './filters/user-exists.filter';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, UserExistsGuard, UserExistsFilter],
  exports: [UsersService],
})
export class UsersModule {}
