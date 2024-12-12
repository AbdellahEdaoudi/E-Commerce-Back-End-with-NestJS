import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt"

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor (@InjectModel(User.name) private userModule:Model<User>){}
  async create(createUserDto: CreateUserDto , payload:any) {
    const ifUserExist = await this.userModule.findOne({
      email:createUserDto.email
    })
    if (ifUserExist) {
      throw new HttpException('User already exist',400);
    }
    const password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const user = {
      password,
      role: createUserDto.role ?? "user",
    }
    return {
      status: 200,
      message: "user creates successfully",
      data : await this.userModule.create({...user,...createUserDto})
    }
  }

  findAll() {
    return this.userModule.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
