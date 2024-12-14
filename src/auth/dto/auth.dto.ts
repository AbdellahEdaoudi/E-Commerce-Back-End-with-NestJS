import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsNumber, Matches, MinLength, MaxLength, IsUrl, Min, IsIn } from 'class-validator';

export class SignUpDto {
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
   password: string;
 
   // Role
   @IsOptional()
   @IsEnum(['admin', 'user'], { message: 'Role must be either Admin or User' })
   role: string;

    // Active (Boolean)
  @IsOptional()
  @IsBoolean()
  @IsIn([true, false], { message: 'Active must be a boolean value (true or false)' })
  active: boolean;
}
export class SignInDto {
  // Name
  @IsString()
  @IsOptional()
  name: string;

  // Email
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  // Password
  @IsString()
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  password: string;

  // Role
  @IsOptional()
  @IsEnum(['admin', 'user'], { message: 'Role must be either Admin or User' })
  role: string;

   // Active (Boolean)
 @IsOptional()
 @IsBoolean()
 @IsIn([true, false], { message: 'Active must be a boolean value (true or false)' })
 active: boolean;
}