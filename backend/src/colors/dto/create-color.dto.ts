import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateColorDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    color: string
}
