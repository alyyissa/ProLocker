import { IsEnum, IsOptional, IsPositive, IsString } from "class-validator";
import { OrderStatus } from "../enums/orders.status.enum";

export class OrderFilterDto {

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: string;

    @IsOptional()
    @IsString()
    date?: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear';

    @IsOptional()
    @IsPositive()
    limit?: number = 10;

    @IsOptional()
    @IsPositive()
    page?: number = 1;
}