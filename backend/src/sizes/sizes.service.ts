import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SizesService {

  constructor(
    @InjectRepository(Size)
    private sizeRepository: Repository<Size>
  ){}

  public async create(createSizeDto: CreateSizeDto) {
    const size = await this.sizeRepository.findOne({
      where: {size: createSizeDto.size}
    })
    if(size){
      return "This size is already found"
    }

    let newSize = this.sizeRepository.create(createSizeDto);
    newSize = await this.sizeRepository.save(newSize);

    return newSize;
  }

  findAll() {
    return this.sizeRepository.find()
  }

  async findOne(id: number): Promise<Size>{
    const size = await this.sizeRepository.findOne({where: {id}});
    if(!size) throw new NotFoundException(`size does not exist`);
    return size;
  }

  update(id: number, updateSizeDto: UpdateSizeDto) {
    return `This action updates a #${id} size`;
  }

  remove(id: number) {
    return `This action removes a #${id} size`;
  }
}
