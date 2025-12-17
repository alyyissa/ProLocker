import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    const { gender, category, color, size, onSale, date, page = 1, limit = 12 } = query;

    const filters: any = {};

    if (gender) filters.gender = +gender;
    if (size) filters.size = +size;
    if (category) filters.category = category;
    if (color) filters.color = color;
    
    if (onSale !== undefined) {
      filters.onSale = onSale;
    }

    return this.productsService.findAll(filters, { page, limit, date });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.productsService.searchProducts(q);
  }

  @Get('search/admin')
  searchByAdmin(@Query('q') q: string) {
    return this.productsService.searchProductsByAdmin(q);
  }

  @Get('most-sold')
  getMostSold(){
    return this.productsService.getMostSoldProducts();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }

  @Post('active/:id')
  toggleActive(
    @Param('id') id: number,
    @Body('isActive') isActive: boolean
  ){
    return this.productsService.toggleActive(id, isActive);
  }

  @Get(':id/related')
  getRelatedProducts(
    @Param('id') id: number,
    @Query('limit') limit?: number
  ) {
    return this.productsService.getRelatedProducts(+id, limit ?? 10);
  }

  @Get('admin/list')
  findAllForAdmin(
  @Query('page') page?: number,
  @Query('limit') limit?: number,
  @Query('gender') gender?: number,
  @Query('category') category?: string,
  @Query('color') color?: string,
  @Query('size') size?: number,
  @Query('sale') sale?: string,
  @Query('date') date?: 'latest' | 'oldest'
) {
  const onSale = sale === '1' ? true : sale === '0' ? false : undefined;
  
  const filters = { 
    gender, 
    category, 
    color, 
    size, 
    onSale
  };
  
  const options = { 
    page: page ? +page : 1, 
    limit: limit ? +limit : 12, 
    date 
  };
  
  return this.productsService.findAllForAdmin(filters, options);
}

}
