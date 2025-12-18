import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @InjectRepository(Permission)
    private permRepo: Repository<Permission>,

    @InjectRepository(User)
    private userRepo: Repository<User>
  ){}

  async isAdmin(userId: number): Promise<boolean>{
    this.logger.debug(`Checking admin status for user ID: ${userId}`);
    
    // First check if user exists
    const user = await this.userRepo.findOne({where: {id: userId}});
    this.logger.debug(`User found: ${!!user}`);
    
    const count = await this.permRepo.count({where: {userId}});
    this.logger.debug(`Permission count for user ${userId}: ${count}`);
    
    const isAdmin = count > 0;
    this.logger.debug(`User ${userId} admin status: ${isAdmin}`);
    
    return isAdmin;
  }
}