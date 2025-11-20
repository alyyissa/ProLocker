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

  async findAll() {
    return await this.colorRepository.find();
  }

  public async findOne(id: number): Promise<Color> {
    const color = await this.colorRepository.findOne({
      where: {id}
    });
    if(!color) throw new NotFoundException(`Color with ${id} not found`);
    return color;
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    const color = await this.colorRepository.findOne({where: {id}});
    if(!color) throw new NotFoundException(`Color with ${id} not found`);

    Object.assign(color, updateColorDto);
    return await this.colorRepository.save(color);
  }

  async remove(id: number) {
    const color = await this.colorRepository.findOne({where: {id}});
    if(!color) throw new NotFoundException(`Color with ${id} not found`);

    const colorName = color.color;
    await this.colorRepository.remove(color);

    return {message: `Color ${colorName} has been removed`}
  }
}