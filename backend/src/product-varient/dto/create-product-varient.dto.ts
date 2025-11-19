import { IsInt, IsNotEmpty } from "class-validator";

export class CreateProductVarientDto {
    @IsNotEmpty()
    @IsInt()
    productId: number;

    @IsNotEmpty()
    @IsInt()
    sizeId: number;

    @IsNotEmpty()
    @IsInt()
    quantity: number;
}
