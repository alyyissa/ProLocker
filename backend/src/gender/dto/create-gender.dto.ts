import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateGenderDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3, {message: 'Gender should not be less than 3 letters'})
    @MaxLength(50, {message: 'Gender should not be more than 50 letters'})
    gender: string
}
