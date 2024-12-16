import {
    IsString,
    IsNotEmpty,
    IsOptional,
    MinLength,
    IsNumber,
    Min,
    IsMongoId,
  } from 'class-validator';
  
  // CreateRequestProductDto
  export class CreateRequestProductDto {
    @IsString({ message: 'Title is required and must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    titleNeed: string;
  
    @IsString({ message: 'Details must be a string' })
    @IsNotEmpty({ message: 'Details are required' })
    @MinLength(5, { message: 'Details must be at least 5 characters long' })
    details: string;
  
    @IsNumber({}, { message: 'Quantity must be a number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    qauntity: number;
  
    @IsOptional()
    @IsString({ message: 'Category must be a string' })
    category?: string;
  
    @IsMongoId({ message: 'User ID must be a valid ObjectId' })
    @IsNotEmpty({ message: 'User ID is required' })
    user: string;
  }
  

  