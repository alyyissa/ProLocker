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

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['color', 'size', 'category', 'gender'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (updateProductDto.colorId !== undefined) {
      const color = await this.colorService.findOne(updateProductDto.colorId);
      product.color = color;
    }

    if (updateProductDto.genderId !== undefined) {
      const gender = await this.genderService.findOne(updateProductDto.genderId);
      product.gender = gender;
    }

    if (updateProductDto.categoryId !== undefined) {
      const category = await this.categoryService.findOne(updateProductDto.categoryId);
      product.category = category;
    }

    if (updateProductDto.sizeId !== undefined) {
      const size = await this.sizeService.findOne(updateProductDto.sizeId);
      product.size = size;
    }

    if (updateProductDto.name !== undefined) product.name = updateProductDto.name;
    if (updateProductDto.price !== undefined) product.price = updateProductDto.price;
    if (updateProductDto.isAvailable !== undefined) product.isAvailable = updateProductDto.isAvailable;

    await this.productRepository.save(product);

    const updated = await this.productRepository.findOne({
      where: { id },
      relations: ['color', 'size', 'category', 'gender'],
    });

    if (!updated) {
      throw new NotFoundException(`Product with id ${id} not found after update`);
    }

    return updated;
  }



  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}