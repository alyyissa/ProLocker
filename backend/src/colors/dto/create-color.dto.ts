import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateColorDto {
    @IsString({message: `the color must be color`})
    @IsNotEmpty()
    @MaxLength(30)
    color: string
}
