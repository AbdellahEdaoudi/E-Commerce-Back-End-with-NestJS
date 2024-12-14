import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { ResetPasswordDto } from './dto/auth.dto';

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
  
  // 1- / reset-password
  @Post('reset-password')
  resetPassword(@Body(new ValidationPipe({forbidNonWhitelisted:true})) 
  email:ResetPasswordDto){
    return this.authService.resetPassword(email)
  }
  // 2- / verify-code
  @Post('verify-code')
  verifyCode(@Body(new ValidationPipe({forbidNonWhitelisted:true}))
  verefCode:{email:string,code:string}
   ){
    return this.authService.verifyCode(verefCode)
  }
  // 3- / change-password
  @Post('change-password')
  changePassword(@Body(new ValidationPipe({forbidNonWhitelisted:true}))
  changePasswordData:ChangePasswordDto){
    return this.authService.changePassword(changePasswordData)
  }

}