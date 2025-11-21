import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductVarientDto } from './dto/create-product-varient.dto';
import { UpdateProductVarientDto } from './dto/update-product-varient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVarient } from './entities/product-varient.entity';
import { SizesService } from 'src/sizes/sizes.service';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ProductVarientService {
  constructor(
    @InjectRepository(ProductVarient)
    private readonly variantRepository: Repository<ProductVarient>,
    private readonly productService: ProductsService,
    private readonly sizeService: SizesService,
  ){}
  
  async create(createDto: CreateProductVarientDto) {
    const product = await this.productService.findOneById(createDto.productId);
    if (!product) {throw new NotFoundException('Product not found');}

    const size = await this.sizeService.findOne(createDto.sizeId);
    if (!size) {throw new NotFoundException('Size not found');}

    const variant = this.variantRepository.create({
      product,
      size,
      quantity: createDto.quantity,
    });

    return this.variantRepository.save(variant);
  }

  findAll() {
    return `This action returns all productVarient`;
  }

  async findOne(id: number) {
    const product = await this.productService.findOneById(id);
    const varients = await this.variantRepository.find({
      where: {
        product: { id }
      },
      relations: ['product', 'size']
    });

    return{
      product:{
        name: product.name,
        // image
      },
      varients: varients.map(v => ({
        id: v.id,
        size: v.size.size,
        quantity: v.quantity,
      }))
    }
  }

  update(id: number, updateProductVarientDto: UpdateProductVarientDto) {
    return `This action updates a #${id} productVarient`;
  }

  remove(id: number) {
    return `This action removes a #${id} productVarient`;
  }
}
