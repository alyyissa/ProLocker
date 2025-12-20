  import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Category } from './entities/category.entity';
  import { MoreThan, Repository } from 'typeorm';
  import { Product } from 'src/products/entities/product.entity';
  import { ProductsService } from 'src/products/products.service';

  @Injectable()
  export class CategoriesService {

    constructor(
      @InjectRepository(Category)
      private categoryRepository: Repository<Category>,

      @InjectRepository(Product)
      private  productRepository: Repository<Product>
    ){}

    public async create(
      createCategoryDto: CreateCategoryDto,
      file: Express.Multer.File,
    ) {
      const slug = createCategoryDto.category
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

      const existing = await this.categoryRepository.findOne({
        where: [{ category: createCategoryDto.category }, { slug }],
      });

      if (existing) {
        throw new BadRequestException('Category already exists.');
      }

      const newCategory = new Category();
      newCategory.category = createCategoryDto.category;
      newCategory.slug = slug;
      newCategory.mainImage = `/uploads/categories/${file.filename}`; // 👈 EXPLICIT

      await this.categoryRepository.save(newCategory);

      return {
        message: 'Created successfully',
        category: newCategory,
      };
    }


    async findAll() {
    const categories = await this.categoryRepository.find();

    const categoriesWithQuantity = await Promise.all(
      categories.map(async (cat) => {
        const count = await this.productRepository.count({
          where: { category: { id: cat.id }, quantity: MoreThan(0) },
          
        });

        return {
          ...cat,
          quantity: count
        };
      })
    );

    return categoriesWithQuantity;
  }

    async findOne(id: number): Promise<Category> {
      const category = await this.categoryRepository.findOne({ where: {id} });
      if(!category) throw new NotFoundException(`Category with ${id} does not exist`);
      return category;
    }

    async update(
      id: number, 
      updateCategoryDto: UpdateCategoryDto, 
      file?: Express.Multer.File
    ) {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) throw new NotFoundException(`Category with ${id} not found`);

      const updatedData: Partial<Category> = { ...updateCategoryDto };

      // Update slug if name changed
      if (updateCategoryDto.category) {
        const slug = updateCategoryDto.category
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '');

        const existing = await this.categoryRepository.findOne({ where: { slug } });
        if (existing && existing.id !== id) {
          throw new BadRequestException('Slug already exists. Choose a different name.');
        }

        updatedData.slug = slug;
      }

      // Update mainImage if a new file is uploaded
      if (file) {
        updatedData.mainImage = `/uploads/categories/${file.filename}`;
      }

      Object.assign(category, updatedData);
      await this.categoryRepository.save(category);

      return { message: 'Category updated successfully', category };
    }


    async remove(id: number) {
      const result = await this.categoryRepository.delete(id)
      if (result.affected === 0) {
        return `Category with ID ${id} not found`;
      }
      return `Category deleted successfully`;
    }
  }
