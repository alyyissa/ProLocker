import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "src/order-items/dto/create-order-item.dto";

export class CreateOrderDto {
    
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    address?: string;

    @IsNotEmpty()
    @IsInt()
    userId: number;

     @IsArray()
     @ValidateNested({ each: true })
     @Type(() => CreateOrderItemDto)
     items: CreateOrderItemDto[];

}
