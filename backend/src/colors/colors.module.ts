import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from './entities/color.entity';
import { Permission } from 'src/permission/entity/permission.entity';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  controllers: [ColorsController],
  providers: [ColorsService],
  imports: [TypeOrmModule.forFeature([Color]), PermissionModule],
  exports: [ColorsService]
})
export class ColorsModule {}
