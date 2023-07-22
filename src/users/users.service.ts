import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = plainToClass(UserEntity, createUserDto);
    return this._userRepository.save(user);
  }

  findAll() {
    return this._userRepository.find({ relations: ['posts'] });
  }

  findOne(id: number) {
    return this._userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = plainToClass(UserEntity, updateUserDto);
    return this._userRepository.update({ id }, updatedUser);
  }

  remove(id: number) {
    return this._userRepository.delete(id);
  }

  async checkIfUserIsAdmin(author: number): Promise<boolean> {
    const user = await this.findOne(author);
    if (user && user.role === 'admin') {
      return true;
    }
    return false;
  }

  getUserByUsername(username: string) {
    return this._userRepository.findOne({ where: { username } });
  }
}
