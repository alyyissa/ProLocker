import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
