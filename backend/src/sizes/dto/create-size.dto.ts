import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateSizeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    size: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    symbol: string
}
