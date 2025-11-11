import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString({message: 'First name should be a string value'})
    @IsNotEmpty()
    @MinLength(3, {message: 'First name should be more than 3 letters'})
    @MaxLength(100,{message:'First name should be more than 3 letters'})
    firstName: string

    @IsString({message: 'Last name should be a string value'})
    @IsNotEmpty()
    @MinLength(3, {message: 'Last name should be more than 3 letters'})
    @MaxLength(100 ,{message: 'Last name should be more than 3 letters'})
    lastName: string

    @IsString({message: 'Email should be a string value'})
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100, {message: 'Email should not be more than 100 digits'})
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'Password should be more than 8 digits'})
    @MaxLength(100, {message: 'Password should not be more than 100 digits'})
    password: string

}
