import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ){}

  public async findAll(
    options: { page?: number; limit?: number } = {}
  ) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const total = await this.userRepository.count();
    const totalPages = Math.ceil(total / limit);

    const currentPage = page > totalPages ? totalPages : page;

    const data = await this.userRepository.find({
      skip: (currentPage - 1) * limit,
      take: limit,
      order: { CreatedAt: 'DESC' }
    });

    return {
      data,
      total,
      page: currentPage,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  public async remove(id: number) {
    let user = await this.userRepository.findOneBy({id});
    if(!user) throw new NotFoundException('Userr not Found')

    await this.userRepository.delete(id);

    return {deleted: true}
  }
}
