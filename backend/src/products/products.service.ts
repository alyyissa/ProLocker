import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { ColorsService } from 'src/colors/colors.service';
import { GenderService } from 'src/gender/gender.service';
import { SizesService } from 'src/sizes/sizes.service';

@Injectable()
export class ProductsService {

  constructor(
    private readonly categoryService: CategoriesService,
    private readonly colorService: ColorsService,
    private readonly genderService: GenderService,
    private readonly sizeService: SizesService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  public async create(createProductDto: CreateProductDto) {
    // Find and validate all FKs
    const category = await this.categoryService.findOne(createProductDto.categoryId);
    const color = await this.colorService.findOne(createProductDto.colorId);
    const gender = await this.genderService.findOne(createProductDto.genderId);
    const size = await this.sizeService.findOne(createProductDto.sizeId);

    // Create the Product
    const product = this.productRepository.create({
      name: createProductDto.name,
      price: createProductDto.price,
      isAvailable: createProductDto.isAvailable,
      category: category,
      color: color,
      gender: gender,
      size: size,
    });

    // Save it
    return await this.productRepository.save(product);
  }

  async findAll(filters?: {gender?: string, category?: string; color?: string; size?: string}): Promise<Product[]> {
      const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.gender', 'gender')
      .leftJoinAndSelect('product.color', 'color')
      .leftJoinAndSelect('product.size', 'size')
      .leftJoinAndSelect('product.category', 'category');

      if (filters?.gender) {
        query.andWhere('gender.gender = :gender', { gender: filters.gender });
      }
      if (filters?.category) {
        query.andWhere('category.name = :category', { category: filters.category });
      }
      if (filters?.color) {
        query.andWhere('color.color = :color', { color: filters.color });
      }
      if (filters?.size) {
        query.andWhere('size.size = :size', { size: filters.size });
      }

      return query.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({where: {id}, relations: ['category', 'color', 'gender', 'size']});
    if(!product) throw new NotFoundException('Product not found');
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}