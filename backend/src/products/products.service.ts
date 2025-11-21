import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { ColorsService } from 'src/colors/colors.service';
import { GenderService } from 'src/gender/gender.service';

@Injectable()
export class ProductsService {

  constructor(
    private readonly categoryService: CategoriesService,
    private readonly colorService: ColorsService,
    private readonly genderService: GenderService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  public async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(createProductDto.categoryId);
    if (!category) throw new NotFoundException('Category not found');

    const color = await this.colorService.findOne(createProductDto.colorId);
    if (!color) throw new NotFoundException('Color not found');

    const gender = await this.genderService.findOne(createProductDto.genderId);
    if (!gender) throw new NotFoundException('Gender not found');

    const product = this.productRepository.create({
        name: createProductDto.name,
        price: createProductDto.price,
        quantity: createProductDto.quantity ?? 0,
        sale: createProductDto.sale ?? 0,
        category,
        color,
        gender,
    });

    return await this.productRepository.save(product);
  }

  async findAll(filters?: { gender?: number; category?: string; color?: string; size?: number }): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.gender', 'gender')
      .leftJoinAndSelect('product.color', 'color')
      .leftJoinAndSelect('product.category', 'category');

    if (filters?.size) {
      query.leftJoin('product.varients', 'varient')
          .leftJoin('varient.size', 'size')
          .andWhere('size.id = :size', { size: filters.size });
    }

    if (filters?.gender) query.andWhere('gender.id = :gender', { gender: filters.gender });
    if (filters?.category) query.andWhere('category.name = :category', { category: filters.category });
    if (filters?.color) query.andWhere('color.color = :color', { color: filters.color });

    return query.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({where: {id}, relations: ['category', 'color', 'gender']});
    if(!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['color', 'category', 'gender'],
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

    if (updateProductDto.name !== undefined) product.name = updateProductDto.name;
    if (updateProductDto.price !== undefined) product.price = updateProductDto.price;
    if (updateProductDto.status !== undefined) product.status = updateProductDto.status;
    if (updateProductDto.quantity !== undefined) product.quantity = updateProductDto.quantity;
    if (updateProductDto.sale !== undefined) product.sale = updateProductDto.sale;
    
    await this.productRepository.save(product);

    const updated = await this.productRepository.findOne({
      where: { id },
      relations: ['color', 'category', 'gender'],
    });

    if (!updated) {
      throw new NotFoundException(`Product with id ${id} not found after update`);
    }

    return updated;
  }

  async remove(id: number) {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
    throw new NotFoundException('Product not found');
    }

    return 'Deleted successfully';
  }
}