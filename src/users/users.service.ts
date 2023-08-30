import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = plainToClass(UserEntity, createUserDto);

    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;

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

  async findByUsername(username: string) {
    return await this._userRepository.findOne({
      where: { username: username },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = plainToClass(UserEntity, updateUserDto);

    const hash = await bcrypt.hash(updatedUser.password, 10);
    updatedUser.password = hash;

    return this._userRepository.update({ id }, updatedUser);
  }

  remove(id: number) {
    return this._userRepository.delete(id);
  }

  async checkIfUserIsAdmin(author: string): Promise<boolean> {
    const user = await this.findByUsername(author);
    if (user && user.role === 'admin') {
      return true;
    }
    return false;
  }

  async updateRole(username: string, role: string) {
    const user = await this._userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    return this._userRepository.save(user);
  }
}
