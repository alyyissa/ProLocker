import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { Repository } from 'typeorm';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private permRepo: Repository<Permission>,

        @InjectRepository(User)
        private userRepo: Repository<User>
    ){}

    async addAdmin(userId: number){
        const user = await this.userRepo.findOne({where: {id: userId}});

        if(!user) throw new NotFoundException(`User not found`);

        const exists = await this.permRepo.count({where: {userId}});

        if(exists > 0) throw new ConflictException('User already admin');

        const admin = this.permRepo.create({userId});

        await this.permRepo.save(admin)

        return {message: 'ADmin added'}
    }

    async isAdmin(userId: number): Promise<boolean>{
        const count = await this.permRepo.count({where: {userId}});
        return count > 0;
    }
}
