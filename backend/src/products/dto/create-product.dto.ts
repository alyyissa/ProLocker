import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min, MinLength } from "class-validator";
import { ProductStatus } from "../enums/product-status.enum";

export class CreateProductDto {
    @IsNotEmpty({message: 'product name should not be empty'})
    @IsString()
    @MinLength(3, {message: 'product name must be at least 3 characters long'})
    name: string;

    @IsNotEmpty({message: 'price should not be empty'})
    @IsInt()
    price: number;

    @IsOptional()
    @IsUrl()
    mainImage?: string

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsUrl({}, { each: true })
    galleryImages?: string[]; 

    @IsInt()
    @Min(0, {message: 'sale must be at least 0'})
    @Min(0, {message: `sale cant be less than 0`})
    @Max(100, {message: `sale cant be more than 100`})
    sale?: number;

    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @IsNotEmpty()
    @IsInt()
    colorId: number;

    @IsNotEmpty()
    @IsInt()
    genderId: number;

    @IsNotEmpty()
    @IsInt()
    categoryId: number;
}
