import { IsArray, IsNumber, IsString, IsOptional, IsEnum, IsBoolean, IsMongoId } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsMongoId({ message: 'User must be a valid MongoDB ObjectId' })
  user: string;

  @IsArray()
  cartItems: Array<{
    productId: string;
    quantity: number;
    color?: string;
    price: number;
  }>;

  @IsNumber()
  texPrice: number;

  @IsNumber()
  shippingPrice: number;

  @IsNumber()
  totalOrderPrice: number;

  @IsEnum(['cash', 'card'])
  paymentMethodType: 'cash' | 'card';

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsString()
  paidAt?: Date;

  @IsOptional()
  @IsBoolean()
  isDeliverd?: boolean;

  @IsOptional()
  @IsString()
  deliverdAt?: Date;

  shippingAddress: {
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };
}
