import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { ProductVarient } from 'src/product-varient/entities/product-varient.entity';
import { ProductVarientModule } from 'src/product-varient/product-varient.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, User, ProductVarient]), ProductVarientModule],
})
export class OrdersModule {}
