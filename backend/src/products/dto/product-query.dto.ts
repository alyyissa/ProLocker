import { IsIn, IsOptional, IsPositive } from "class-validator";

export class ProductQueryDto {
    @IsOptional()
    gender?: number;

    @IsOptional()
    size?: number;

    @IsOptional()
    category?: string;

    @IsOptional()
    color?: string;

    @IsOptional()
    @IsIn(['latest', 'oldest'])
    date?: 'latest' | 'oldest';

    @IsOptional()
    @IsPositive()
    limit ?: number = 12;

    @IsOptional()
    @IsPositive()
    page ?: number = 1;

    @IsOptional()
    onSale?: string;
}