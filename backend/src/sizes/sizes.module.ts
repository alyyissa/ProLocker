import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  controllers: [SizesController],
  providers: [SizesService],
  imports: [TypeOrmModule.forFeature([Size]), PermissionModule],
  exports: [SizesService]
})
export class SizesModule {}
