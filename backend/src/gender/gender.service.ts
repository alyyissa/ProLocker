import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender } from './entities/gender.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenderService {

  @InjectRepository(Gender)
  private genderRepository: Repository<Gender>

  public async create(createGenderDto: CreateGenderDto) {
    const gender = await this.genderRepository.findOne({
      where: {gender: createGenderDto.gender}
    })
    if(gender){
      return 'Gender already exists'
    }

    let newGender = this.genderRepository.create(createGenderDto)
    newGender = await this.genderRepository.save(newGender);
    return newGender
  }

  async findAll() {
    return await this.genderRepository.find();
  }

  async findOne(id: number): Promise<Gender> {
    const gender = await this.genderRepository.findOne({where: {id}});
    if(!gender) throw new NotFoundException(`Gender does not exist`);
    return gender;
  }

  async update(id: number, updateGenderDto: UpdateGenderDto) {
    const existingGender = await this.genderRepository.findOne({where: {id}});
    if(!existingGender) throw new NotFoundException(`Gender with ${id} not found`);

    if(updateGenderDto.gender){
      const exists = await this.genderRepository.findOne({
        where: {gender: updateGenderDto.gender}
      });
      if(exists && exists.id !== id){
        return 'Gender already exists';
      }
    }
    Object.assign(existingGender, updateGenderDto);
    await this.genderRepository.save(existingGender);
    return {message: `Gender updated successfully`};
  }

  async remove(id: number) {
    const result = await this.genderRepository.delete(id);
    if(result.affected === 0){
      return `Gender with ID ${id} not found`;
    }
    return `Gender deleted successfully`;
  }
}
