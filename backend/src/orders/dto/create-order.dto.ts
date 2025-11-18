import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
    
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    address?: string;

    userId: number;

    items:{
        productId: number;
        quantity: number;
    }[];

}
