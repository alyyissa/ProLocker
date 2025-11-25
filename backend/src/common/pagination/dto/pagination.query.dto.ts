import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {

    @IsOptional()
    @IsPositive()
    limit?: number = 12;

    @IsOptional()
    @IsPositive()
    page?: number = 1;

}