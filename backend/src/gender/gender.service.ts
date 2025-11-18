import { Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all gender`;
  }

  public async findOne(id: number) {
    return await this.genderRepository.findOneBy({id})
  }

  update(id: number, updateGenderDto: UpdateGenderDto) {
    return `This action updates a #${id} gender`;
  }

  remove(id: number) {
    return `This action removes a #${id} gender`;
  }
}
