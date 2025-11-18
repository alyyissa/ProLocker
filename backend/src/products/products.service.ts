import { Injectable } from '@nestjs/common';
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

  findAll(): Promise<Product[]> {
    const products = this.productRepository.find({
      relations: ['category', 'color', 'gender', 'size'],
      });
    return products;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}