import { IsString, IsInt, Min, Max, IsNotEmpty, IsMongoId, IsOptional, Length, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsString({ message: 'Review text must be a string' })
  @IsNotEmpty({ message: 'Review text cannot be empty' })
  @Length(3, 255, { message: 'Review text must be at least 3 characters' })
  reviewText: string;

  @IsNumber({},{ message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;

  @IsOptional()
  @IsMongoId({ message: 'User must be a valid MongoDB ObjectId' })
  user: string;

  @IsMongoId({ message: 'Product must be a valid MongoDB ObjectId' })
  product: string;
}
