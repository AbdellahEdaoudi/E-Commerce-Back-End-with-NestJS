import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/auth.dto';
import { User } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) 
  private userModule: Model<User>,
  private jwtService: JwtService
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
    const payload = { userId: newUser._id,email:newUser.email, role: newUser.role };
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
    const payload = { userId: user._id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload, { 
      secret: process.env.JWT_SECRET 
    });

    return {
      message: 'Login successful',
      access_token: token,
    };
}

}
