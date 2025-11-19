import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateOrderItemDto {

    @IsNotEmpty()
    @IsInt()
    productVarientId: number;

    @IsInt()
    @Min(1)
    quantity: number;

}
