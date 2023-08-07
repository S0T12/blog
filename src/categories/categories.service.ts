import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this._categoryRepository.save(createCategoryDto);
  }

  async findAll() {
    return await this._categoryRepository.find();
  }

  findOne(id: number) {
    return this._categoryRepository.findOne({ where: { id } });
  }

  findOneByName(name: string) {
    return this._categoryRepository.findOne({ where: { name } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this._categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this._categoryRepository.delete(id);
  }
}
