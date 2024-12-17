import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTaxDto {
    
  @IsOptional()
  @IsNotEmpty({ message: 'Tax price is required and cannot be empty.' })
  @IsNumber({}, { message: 'Tax price must be a number.' })
  taxPrice: number;
  
  @IsOptional()
  @IsNotEmpty({ message: 'Shipping price is required and cannot be empty.' })
  @IsNumber({}, { message: 'Shipping price must be a number.' })
  shippingPrice: number;
}
