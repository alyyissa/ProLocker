import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private useRepository: Repository<User>
  ){}

  public async create(createUserDto: CreateUserDto) {
    const user = await this.useRepository.findOne({
      where: { email: createUserDto.email}
    })

    if(user){
      return 'The cardentials are wrong!';
    }

    let newUser = this.useRepository.create();
    newUser = await this.useRepository.save(newUser);

    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
