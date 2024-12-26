import { IsOptional } from "class-validator";

export class CreateOrderDto {
  @IsOptional()
  shippingAddress: string;
}
