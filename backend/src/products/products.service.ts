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
    if (!category) throw new Error('Category not found');

    const color = await this.colorService.findOne(createProductDto.colorId);
    if (!color) throw new Error('Color not found');

    const gender = await this.genderService.findOne(createProductDto.genderId);
    if (!gender) throw new Error('Gender not found');

    const size = await this.sizeService.findOne(createProductDto.sizeId);
    if (!size) throw new Error('Size not found');

    // Create the Product
    const product = this.productRepository.create({
      ...createProductDto,
      category: category,
      color: color,
      gender: gender,
      size: size,
    });

    // Save it
    return await this.productRepository.save(product);
  }

  findAll() {
    return `This action returns all products`;
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