import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString({message: 'First name should be a string value'})
    @IsNotEmpty()
    firstName: string
    
    @IsString({message: 'Last name should be a string value'})
    @IsNotEmpty()
    lastName: string

    @IsString({message: 'Email should be a string value'})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'password should be more than 8 digits'})
    password: string

}
