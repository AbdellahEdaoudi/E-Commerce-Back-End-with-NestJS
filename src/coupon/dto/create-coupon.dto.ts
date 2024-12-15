import { IsNotEmpty, IsDate, IsNumber, IsString, IsDateString, Length, Min, MinDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCouponDto {
  @IsString({ message: 'Name must be a string' })
  @Length(3, 30, { message: 'Name must be between 3 and 30 characters' })
  name: string;

  @Transform(({ value }) => new Date(value)) // Convert string to Date object
  @IsDate({ message: 'Expiry date must be a valid date.' })
  @MinDate(new Date(), { message: 'Expire date must be in the future.' })
  expirdate: Date;

  @IsNotEmpty({ message: 'Discount is required.' })
  @IsNumber({}, { message: 'Discount must be a number.' })
  @Min(0, { message: 'Discount must be at least 0.' })
  discount: number;
}
