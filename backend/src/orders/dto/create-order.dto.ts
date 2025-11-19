import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "src/order-items/dto/create-order-item.dto";
import { OrderStatus } from "../enums/orders.status.enum";

export class CreateOrderDto {
    
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    address?: string;

    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsEnum(OrderStatus)
    @IsOptional()
    status: string;

     @IsArray()
     @ValidateNested({ each: true })
     @Type(() => CreateOrderItemDto)
     items: CreateOrderItemDto[];

}
