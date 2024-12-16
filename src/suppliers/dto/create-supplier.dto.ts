import { IsString, IsUrl, Length, IsNotEmpty } from 'class-validator';

// CreateSupplierDto
export class CreateSupplierDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name: string;

  @IsUrl({}, { message: 'Website must be a valid URL' })
  @IsNotEmpty({ message: 'Website is required' })
  website: string;
}


