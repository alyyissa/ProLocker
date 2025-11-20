import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ){}

  public async create(createCategoryDto: CreateCategoryDto) {
    // Checking If Created
    const category = await this.categoryRepository.findOne({
      where: {name: createCategoryDto.name}
    })
    //Throwing Exception
    if(category){
      return "Already exists";
    }

    let newCategory = this.categoryRepository.create(createCategoryDto);
    newCategory = await this.categoryRepository.save(newCategory);

    return newCategory;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: {id} });
    if(!category) throw new NotFoundException(`Category with ${id} does not exist`);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({where: {id}});
    if(!category) throw new NotFoundException(`Category with ${id} not found`);

    Object.assign(category, updateCategoryDto);
    await this.categoryRepository.save(category);

    return `Category updated successfully`;
  }

  async remove(id: number) {
    const result = await this.categoryRepository.delete(id)
    if (result.affected === 0) {
      return `Category with ID ${id} not found`;
    }
    return `Category deleted successfully`;
  }
}
