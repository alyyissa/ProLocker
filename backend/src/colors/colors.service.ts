import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from './entities/color.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ColorsService {

  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>
  ){}

  public async create(createColorDto: CreateColorDto) {
    const color = await this.colorRepository.findOne({
      where: {color: createColorDto.color} 
    })
    if(color){
      return "Color Already Exists";
    }

    let newColor = this.colorRepository.create(createColorDto);
    newColor = await this.colorRepository.save(newColor);

    return newColor;
  }

  findAll() {
    return `This action returns all colors`;
  }

  public async findOne(id: number): Promise<Color> {
    const color = await this.colorRepository.findOne({
      where: {id}
    });
    if(!color) throw new NotFoundException(`Color with ${id} not found`);
    return color;
  }

  update(id: number, updateColorDto: UpdateColorDto) {
    return `This action updates a #${id} color`;
  }

  remove(id: number) {
    return `This action removes a #${id} color`;
  }
}
