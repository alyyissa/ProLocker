import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateOrderItemDto {

    @IsNotEmpty()
    @IsInt()
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;

}
