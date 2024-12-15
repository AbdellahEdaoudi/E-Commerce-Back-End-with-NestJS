import { IsOptional, IsString, Length, IsUrl } from 'class-validator';

// CreateCategoryDto
export class CreateCategoryDto {
    @IsString({ message: 'Name must be a string' })
    @Length(3, 30, { message: 'Name must be between 3 and 30 characters' })
    name: string;
    
    @IsOptional()
    @IsUrl({}, { message: 'Image must be a valid URL' })
    image?: string;
  }