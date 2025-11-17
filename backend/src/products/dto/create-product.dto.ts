import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class CreateProductDto {
    @IsNotEmpty({message: 'product name should not be empty'})
    @IsString()
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

}
