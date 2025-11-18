import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { ColorsModule } from 'src/colors/colors.module';
import { GenderModule } from 'src/gender/gender.module';
import { SizesModule } from 'src/sizes/sizes.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[TypeOrmModule.forFeature([Product]), CategoriesModule, ColorsModule, GenderModule, SizesModule]
})
export class ProductsModule {}
