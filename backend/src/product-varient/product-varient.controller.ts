import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductVarientService } from './product-varient.service';
import { CreateProductVarientDto } from './dto/create-product-varient.dto';
import { UpdateProductVarientDto } from './dto/update-product-varient.dto';

@Controller('product-varient')
export class ProductVarientController {
  constructor(private readonly productVarientService: ProductVarientService) {}

  @Post()
  create(@Body() createProductVarientDto: CreateProductVarientDto) {
    return this.productVarientService.create(createProductVarientDto);
  }

  @Get()
  findAll() {
    return this.productVarientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVarientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductVarientDto: UpdateProductVarientDto) {
    return this.productVarientService.update(+id, updateProductVarientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVarientService.remove(+id);
  }
}
