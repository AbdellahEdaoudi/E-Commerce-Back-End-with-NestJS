import { IsOptional, IsString, Length, IsUrl, IsMongoId, IsNotEmpty } from 'class-validator';

// CreateSubCategoryDto
export class SubCreateCategoryDto {
    @IsString({ message: 'Name must be a string' })
    @Length(3, 30, { message: 'Name must be between 3 and 30 characters' })
    name: string;

    @IsMongoId({ message: 'Category must be a valid MongoDB ObjectId' })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Category is required and cannot be empty' })
    category: string; 

  }