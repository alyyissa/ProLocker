import { IsBoolean, IsInt, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({message: 'product name should not be empty'})
    @IsString()
    @MinLength(3, {message: 'product name must be at least 3 characters long'})
    name: string

    @IsNotEmpty({message: 'price should not be empty'})
    @IsInt()
    price: number

    @IsNotEmpty()
    @IsBoolean()
    isAvailable: boolean;

    @IsNotEmpty()
    @IsInt()
    colorId: number;

    @IsNotEmpty()
    @IsInt()
    genderId: number;

    @IsNotEmpty()
    @IsInt()
    categoryId: number;

    @IsNotEmpty()
    @IsInt()
    sizeId: number;

}
