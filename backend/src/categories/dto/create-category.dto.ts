import { IsNotEmpty, IsOptional, IsString, IsUrl, Max, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    category: string

}


