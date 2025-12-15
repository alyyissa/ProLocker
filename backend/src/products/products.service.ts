import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityManager, Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { ColorsService } from 'src/colors/colors.service';
import { GenderService } from 'src/gender/gender.service';
import { ProductStatus } from './enums/product-status.enum';

@Injectable()
export class ProductsService {

  constructor(
    private readonly categoryService: CategoriesService,
    private readonly colorService: ColorsService,
    private readonly genderService: GenderService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(createProductDto.categoryId);
    if (!category) throw new NotFoundException('Category not found');

    const color = await this.colorService.findOne(createProductDto.colorId);
    if (!color) throw new NotFoundException('Color not found');

    const gender = await this.genderService.findOne(createProductDto.genderId);
    if (!gender) throw new NotFoundException('Gender not found');

    let baseSlug = createProductDto.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    let slug = baseSlug;
    let count = 1;

    while (await this.productRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const product = this.productRepository.create({
        name: createProductDto.name,
        price: createProductDto.price,
        quantity: 0,
        sale: createProductDto.sale ?? 0,
        isActive: true,
        category,
        color,
        gender,
        slug,
    });

    await this.productRepository.save(product);

    return { message: 'Product Created successfully', product };
  }

  async findAll(filters?: { gender?: number; category?: string; color?: string; size?: number },
    options: { page?: number; limit?: number; date?: 'latest' | 'oldest' } = {}
  ){

    const { page = 1, limit = 12, date } = options;

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.gender', 'gender')
      .leftJoinAndSelect('product.color', 'color')
      .leftJoinAndSelect('product.category', 'category');

    if (filters?.size) {
      query.leftJoin('product.varients', 'varient')
          .leftJoin('varient.size', 'size')
          .andWhere('size.id = :size', { size: filters.size });
    }

    if (filters?.gender) query.andWhere('gender.id = :gender', { gender: filters.gender });
    if (filters?.category) query.andWhere('category.category = :category', { category: filters.category });
    if (filters?.color) query.andWhere('color.color = :color', { color: filters.color });

    query.andWhere('(product.quantity > 0 OR product.status = :fewLeft)', { fewLeft: 'Few Left' });
    
    query.skip((page - 1) * limit).take(limit);

    if (date === 'latest') query.orderBy('product.createdAt', 'DESC');
    else if (date === 'oldest') query.orderBy('product.createdAt', 'ASC');
    else query.orderBy('product.createdAt', 'DESC');

    const [data , total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findForAdmin(){
    const data = this.productRepository.find({
      relations: ['color', 'category', 'gender', 'varients', 'varients.size']
    })
    return data
  }

  async findOne(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['color', 'category', 'gender', 'varients', 'varients.size']
    });

    if (!product) throw new NotFoundException(`${slug} not found`);
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

  async findOneById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    
    return product;
  }

  async refreshProductData(productId: number, manager?: EntityManager) {
    const product = manager 
      ? await manager.findOne(Product, { where: { id: productId }, relations: ['varients'] })
      : await this.productRepository.findOne({ where: { id: productId }, relations: ['varients'] });

    if (!product) throw new NotFoundException('Product not found');

    product.quantity = product.varients.reduce((sum, varient) => sum + (varient.quantity || 0), 0);

    if(product.quantity === 0) product.status = ProductStatus.OutOfStock;
    else if(product.quantity < 3) product.status = ProductStatus.FewLeft;
    else product.status = ProductStatus.Available;

    if (manager) await manager.save(product);
    else await this.productRepository.save(product);
  }

  async getMostSoldProducts(){
    return await  this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.varients', 'varient')
      .leftJoin('varient.orderItems', 'orderItem')
      .select('product.id', 'id')
      .addSelect('product.mainImage', 'mainImage')
      .addSelect('product.priceAfterSale', 'priceAfterSale')
      .addSelect('product.sale', 'sale')
      .addSelect('ANY_VALUE(product.name)', 'name')
      .addSelect('ANY_VALUE(product.price)', 'price')
      .addSelect('SUM(orderItem.quantity)', 'totalSold')
      .where('product.deletedAt IS NULL')
      .groupBy('product.id')
      .orderBy('totalSold', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async toggleActive(productId: number, isActive: boolean){
    const product = await this.productRepository.findOne({where: {id: productId}})
    if(!product) throw new NotFoundException(`Product Not Found`);

    product.isActive = isActive;
    await this.productRepository.save(product);

    return{
      message: `${product.name} has been ${isActive ? 'activated': 'deactivated'}`
    }
  }

  async searchProducts(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return await this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.slug',
        'product.price',
        'product.priceAfterSale',
        'product.mainImage',
        'product.status',
      ])
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('(product.quantity > 0 OR product.status = :fewLeft)', {
        fewLeft: ProductStatus.FewLeft,
      })
      .andWhere('LOWER(product.name) LIKE LOWER(:query)', {
        query: `%${query}%`,
      })
      .orderBy('product.createdAt', 'DESC')
      .take(6)
      .getMany();
  }

  async getRelatedProducts(productId: number, limit = 10) {
  const product = await this.productRepository.findOne({
    where: { id: productId },
    relations: ['category'],
  });

  if (!product) throw new NotFoundException('Product not found');

  return await this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.color', 'color')
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.gender', 'gender')
    .where('product.categoryId = :categoryId', {
      categoryId: product.category.id,
    })
    .andWhere('product.id != :productId', { productId })
    .andWhere('product.isActive = true')
    .andWhere('(product.quantity > 0 OR product.status = :fewLeft)', {
      fewLeft: ProductStatus.FewLeft,
    })
    .orderBy('RAND()')
    .take(limit)
    .getMany();
  }


}