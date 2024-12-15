import { IsNotEmpty, IsString, IsOptional, IsUrl, MinLength, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty({ message: 'Name is required and cannot be empty.' })
  @IsString({ message: 'Name must be a string.' })
  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters.' })
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'Image must be a valid URL.' })
  image?: string; // Optional field
}
