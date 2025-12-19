import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PermissionService {

  constructor(
    @InjectRepository(Permission)
    private permRepo: Repository<Permission>,

    @InjectRepository(User)
    private userRepo: Repository<User>
  ){}

  async isAdmin(userId: number): Promise<boolean>{
    
    const user = await this.userRepo.findOne({where: {id: userId}});
    
    const count = await this.permRepo.count({where: {userId}});
    
    const isAdmin = count > 0;
    
    return isAdmin;
  }
}