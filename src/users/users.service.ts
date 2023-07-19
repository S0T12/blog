import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this._userRepository.save(createUserDto);
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
    return this._userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this._userRepository.delete(id);
  }
}
