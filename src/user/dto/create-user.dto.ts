import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsNumber, Matches, MinLength, MaxLength, IsUrl, Min, IsIn } from 'class-validator';

export class CreateUserDto {
  // Name
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  name: string;

  // Email
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  // Password
  @IsString()
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  password: string;

  // Role
  @IsOptional()
  @IsEnum(['admin', 'user'], { message: 'Role must be either Admin or User' })
  role: string;

  // Avatar (Optional)
  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string;

  // Age (Optional)
  @IsOptional()
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(18, { message: 'Age must be at least 18' })
  age?: number;

  // Phone Number (Optional)
  @IsOptional()
  @Matches(/^06[0-9]{8}$/, { message: 'Phone number must be a valid  mobile number' })
  phoneNumber?: string;

  // Address (Optional)
  @IsOptional()
  @IsString()
  address?: string;

  // Active (Boolean)
  @IsOptional()
  @IsBoolean()
  @IsIn([true, false], { message: 'Active must be a boolean value (true or false)' })
  active: boolean;

  // Verification Code
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Verification code must be at least 6 characters long' })
  verificationCode: string;

  // Gender
  @IsOptional()
  @IsEnum(['male', 'female'], { message: 'Gender must be either male or female' })
  gender: string;
}