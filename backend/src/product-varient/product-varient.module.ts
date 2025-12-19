import { Module } from '@nestjs/common';
import { ProductVarientService } from './product-varient.service';
import { ProductVarientController } from './product-varient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVarient } from './entities/product-varient.entity';
import { SizesModule } from 'src/sizes/sizes.module';
import { ProductsModule } from 'src/products/products.module';
import { Product } from 'src/products/entities/product.entity';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  controllers: [ProductVarientController],
  providers: [ProductVarientService],
  imports: [TypeOrmModule.forFeature([ProductVarient, Product]), SizesModule, ProductsModule, PermissionModule],
  exports: [ProductVarientService],
})
export class ProductVarientModule {}
