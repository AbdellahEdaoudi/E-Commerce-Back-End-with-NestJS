import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) SignUpDto:SignUpDto){
    return this.authService.signUp(SignUpDto);
  }
  @Post('sign-in')
  signIn(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) SignInDto:SignInDto){
    return this.authService.signIn(SignInDto);
  }
}
