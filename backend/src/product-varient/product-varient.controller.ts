import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductVarientService } from './product-varient.service';
import { CreateProductVarientDto } from './dto/create-product-varient.dto';
import { UpdateProductVarientDto } from './dto/update-product-varient.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

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
  
  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.productVarientService.findByProduct(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVarientService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductVarientDto: UpdateProductVarientDto) {
    return this.productVarientService.update(+id, updateProductVarientDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVarientService.remove(+id);
  }
}
