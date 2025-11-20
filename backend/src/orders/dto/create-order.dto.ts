import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "src/order-items/dto/create-order-item.dto";
import { OrderStatus } from "../enums/orders.status.enum";

export class CreateOrderDto {
    
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsEnum(OrderStatus)
    @IsOptional()
    status: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    apartment?: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    country?: string = 'Lebanon';

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

}
