import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    const slug = createColorDto.color.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const existing = await this.colorRepository.findOne({ 
      where: [
        {color: createColorDto.color},
        {slug},
      ]
    });

    if(existing){
      throw new BadRequestException('Color already exists. Choose a different name.');
    }

    const newColor = this.colorRepository.create({
      ...createColorDto,
      slug,
    });

    await this.colorRepository.save(newColor);

    return { message: 'Created successfully', color: newColor };
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

    const updatedData = { ...updateColorDto };

    if(updateColorDto.color){
      const slug = updateColorDto.color
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

        const existing = await this.colorRepository.findOne({ 
        where: { slug } 
        });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Slug already exists. Choose a different name.');
      }
      
      updatedData['slug'] = slug;
    }

    Object.assign(color, updatedData);
    await this.colorRepository.save(color);
    
    return {message: `Color updated successfully`};
  }

  async remove(id: number) {
    const color = await this.colorRepository.findOne({where: {id}});
    if(!color) throw new NotFoundException(`Color with ${id} not found`);

    const colorName = color.color;
    await this.colorRepository.remove(color);

    return {message: `Color ${colorName} has been removed`}
  }
}