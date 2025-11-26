import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductVarientDto } from './dto/create-product-varient.dto';
import { UpdateProductVarientDto } from './dto/update-product-varient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVarient } from './entities/product-varient.entity';
import { SizesService } from 'src/sizes/sizes.service';
import { EntityManager, Repository } from 'typeorm';
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

    await this.variantRepository.save(variant);
    await this.productService.refreshProductData(product.id);
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

  async update(id: number, updateProductVarientDto: UpdateProductVarientDto) {
    const varient = await this.variantRepository.findOne({
      where: {id},
      relations: ['product', 'size']
    });
    if(!varient) throw new NotFoundException(`Product Varient with ${id} not found`);

    if(updateProductVarientDto.quantity !== undefined){
      varient.quantity = updateProductVarientDto.quantity;
    }

    await this.variantRepository.save(varient);

    await this.productService.refreshProductData(varient.product.id);

    return { message: 'Updated successfully'};
  }

  async checkVariantAvailability(productId: number, sizeId: number) {
    const variant = await this.variantRepository.findOne({
      where: { product: { id: productId }, size: { id: sizeId } },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    if (variant.quantity <= 0) {
      throw new BadRequestException('Selected size is out of stock');
    }

    return variant;
  }

  async remove(id: number) {
    return `This action removes a #${id} productVarient`;
  }

  async reduceStock(productVarientId: number, quantity: number, manager: EntityManager) {
    const variant = await manager.findOne(ProductVarient, { where: { id: productVarientId }, relations: ['product'] });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if(variant.quantity < quantity) {
      throw new BadRequestException('Insufficient stock for the requested quantity');
    }

    variant.quantity -= quantity;
    await manager.save(variant);
    await this.productService.refreshProductData(variant.product.id, manager);
  }

  async restoreStock(productVarientId:number, quantity:number, manager: EntityManager){
    const variant = await manager.findOne(ProductVarient,{
      where: {id: productVarientId},
      relations: ['product']
    });

    if(!variant) throw new NotFoundException('Product variant not found');

    variant.quantity += quantity;

    await manager.save(variant)

    await this.productService.refreshProductData(variant.product.id, manager)
  }
  
}
