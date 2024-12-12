import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { request } from 'express'

@Injectable()
export class UserService {
  constructor (@InjectModel(User.name) private userModule:Model<User>){}
  async create(createUserDto: CreateUserDto,payload:string) {
    return "ok"
    // return this.userModule.create(createUserDto);
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
