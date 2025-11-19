import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
findAll(
  @Query('gender') gender?: string,
  @Query('category') category?: string,
  @Query('color') color?: string,
  @Query('size') size?: string,
) {
  const filters: any = {};

  if (gender) filters.gender = +gender; // convert to number
  if (size) filters.size = +size;       // convert to number
  if (category) filters.category = category;
  if (color) filters.color = color;

  return this.productsService.findAll(filters);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
