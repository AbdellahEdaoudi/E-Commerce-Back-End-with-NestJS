import { IsArray, IsNumber, IsOptional, IsString, IsUrl, Length, Min, Max, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsString({ message: 'Title must be a string' })
  @Length(3, undefined, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @Length(20, undefined, { message: 'Description must be at least 20 characters long' })
  description: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(500, { message: 'Quantity cannot exceed 500' })
  quantity: number;

  @IsUrl({}, { message: 'Image Cover must be a valid URL' })
  imageCover: string;

  @IsOptional()
  @IsArray({ message: 'Images must be an array of URLs' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'Sold must be a number' })
  @Min(1, { message: 'Sold must be at least 1' })
  sold?: number;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(1, { message: 'Price must be at least 1' })
  @Max(20000, { message: 'Price cannot exceed 20000' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Price After Discount must be a number' })
  @Min(0, { message: 'Price After Discount must be at least 1' })
  @Max(20000, { message: 'Price After Discount cannot exceed 20000' })
  priceAfterDiscount?: number;

  @IsOptional()
  @IsArray({ message: 'Colors must be an array of strings' })
  @IsString({ each: true, message: 'Each color must be a string' })
  colors?: string[];

  @IsString({ message: 'Category ID must be a string' })
  @IsMongoId({ message: 'Category ID must be a valid MongoDB ObjectId' })
  category: Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'SubCategory ID must be a string' })
  @IsMongoId({ message: 'SubCategory ID must be a valid MongoDB ObjectId' })
  subCategory?: Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'Brand ID must be a string' })
  @IsMongoId({ message: 'Brand ID must be a valid MongoDB ObjectId' })
  brand?: Types.ObjectId;

  @IsOptional()
  @IsNumber({}, { message: 'Ratings Average must be a number' })
  @Min(0, { message: 'Ratings Average must be at least 0' })
  @Max(5, { message: 'Ratings Average cannot exceed 5' })
  ratingsAverage?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Ratings Quantity must be a number' })
  @Min(0, { message: 'Ratings Quantity must be at least 0' })
  ratingsQuantity?: number;
}
