import { Injectable, HttpException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto, SignUpDto } from './dto/auth.dto';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) 
  private userModule: Model<User>,
  private jwtService: JwtService,
  private readonly emailService: MailerService
) {}

  async signUp(SignUpDto: SignUpDto) {
    const existingUser = await this.userModule.findOne({ email: SignUpDto.email });
    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }
    const saltOrRounds = 10;
      const password = await bcrypt.hash(SignUpDto.password, saltOrRounds);
      const newUser = await this.userModule.create({
        ...SignUpDto,
        password,
        role: 'user',
        active:true
      });
    // Generate JWT Token
    const payload = { _id: newUser._id,email:newUser.email, role: newUser.role };
    const token = await this.jwtService.signAsync(payload,{ 
      secret: process.env.JWT_SECRET
      });

      return {
        status: 201,
        message: 'User created successfully',
        data: newUser,
        access_token: token,
      };
  }

  async signIn(SignUpDto: SignUpDto) {
    const user = await this.userModule.findOne({ email: SignUpDto.email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const passwordMatches = await bcrypt.compare(SignUpDto.password, user.password);
    if (!passwordMatches) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }

    // Generate JWT Token
    const payload = { _id: user._id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload, { 
      secret: process.env.JWT_SECRET 
    });

    return {
      message: 'Login successful',
      access_token: token,
    };
  }

  // resetPassword
  async resetPassword(ResetPasswordDto:ResetPasswordDto){
    const user = await this.userModule.findOne({ email: ResetPasswordDto.email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    // create code 6 digit
    const code = Math.floor(Math.random() * 1000000).toString().padStart(6,'0');
    console.log(code);
    await this.userModule.findOneAndUpdate({email:ResetPasswordDto.email},{verificationCode:code})
    // send Code to User Email
    const htmlmessage = `
    <!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .email-header {
        color: #007BFF;
        text-align: center;
        margin-bottom: 20px;
      }
      .verification-code {
        text-align: center;
        margin: 20px 0;
      }
      .code {
        font-size: 24px;
        font-weight: bold;
        color: #FF0000;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h2 class="email-header">Reset Your Password</h2>
      <p>Forgot your password? No worries, we’ve got you covered!</p>
      <p>Use the following code to reset your password:</p>
      <div class="verification-code">
        <span class="code">${code}</span>
      </div>
      <p>If you didn’t request a password reset, please ignore this email.</p>
      <p class="footer">Best regards,<br>Your Team</p>
    </div>
  </body>
</html>

  `;
    this.emailService.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: `How to Send Emails with NodeMailer(Nest.js)`,
      html:htmlmessage
      
    })
    return {
      status :200 ,
      message : `Code sent  successfully on your email (${user.email})`,
      code : code
    }
  }
  // verefyCode
  async verifyCode(verefCode :{email:string,code:string}){
    const { email, code } = verefCode;
  const user = await this.userModule.findOne({ email }).select('verificationCode');
  if (!user) {
    throw new NotFoundException('User not found');
  }
  if (user.verificationCode !== code) {
    throw new UnauthorizedException('Invalid code'+user.verificationCode);
  }
  await this.userModule.findOneAndUpdate({email},{verificationCode:null})
  return {
    status : 200,
    message : 'Code verified successfully go to change your password'
  }
  }
  // changePassword
  async changePassword(ChangePasswordDto:ChangePasswordDto){
    const user = await this.userModule.findOne({email:ChangePasswordDto.email});
    if (!user) {
      throw new NotFoundException('User Not Found')
    }
    const password = await bcrypt.hash(ChangePasswordDto.password,10)
    await this.userModule.findOneAndUpdate({email:ChangePasswordDto.email},{password});
    return {
      status:200,
      message:"Password Changed successfullt , Go to Login",
    }
  }

}
