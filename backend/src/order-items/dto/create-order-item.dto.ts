import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateOrderItemDto {

    @IsNotEmpty()
    @IsInt()
    productVarientId: number;

    @IsInt()
    @Min(1)
    @Max(2)
    quantity: number;

}
