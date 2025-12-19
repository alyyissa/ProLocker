import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  imports: [TypeOrmModule.forFeature([OrderItem]),PermissionModule],
})
export class OrderItemsModule {}
