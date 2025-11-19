import { PartialType } from '@nestjs/mapped-types';
import { CreateProductVarientDto } from './create-product-varient.dto';

export class UpdateProductVarientDto extends PartialType(CreateProductVarientDto) {}
