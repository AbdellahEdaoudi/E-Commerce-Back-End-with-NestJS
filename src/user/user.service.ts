import { HttpException, HttpStatus, Injectable, NotFoundException, Param } from '@nestjs/common';
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

  async create(createUserDto: CreateUserDto) {
  const ifUserExist = await this.userModule.findOne({
    email: createUserDto.email
  });

  if (ifUserExist) {
    throw new HttpException('User already exists', 400);
  }
  try {
    const saltOrRounds = 10;
    const password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    console.log('Encrypted password:', password);
    
    const user = {
      ...createUserDto,
      password,
      role: createUserDto.role ?? "user",
    };

    const createdUser = await this.userModule.create(user);

    return {
      status: 200,
      message: "User created successfully",
      data: createdUser
    };
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new HttpException('Error hashing password', 500);
  }
}
  // pagination
  async findAll(query) {
    const {_limit,skip,sort,name,email,role} = query;
    // if (Number.isNaN(Number(+_limit))) {
    //   throw new HttpException('Invalid limit',400)
    // }
    const users = await this.userModule.find()
    .skip(Number(skip) || 0)
    .limit(Number(_limit) || 1)
    // or => whare by all keyword, regex => whare by any keyword
    // .or([{name},{email},{role}])
    .where('name',new RegExp(name,'i'))
    .where('email',new RegExp(email,'i'))
    .where('role',new RegExp(role,'i'))
    .sort(sort || {})
    .select('-password -__v')
    .exec();
    return {
      status : 200,
      message:'Users found successfully',
      leangth:users.length,
      data : users
    }
  }

  async findOne(id: string) {
    const user = await this.userModule.findById(id).select('-password -__v')
    if (!user) {
      throw new NotFoundException("User Not found")
    }
    return user;
  }

   async update(id: string, updateUserDto: UpdateUserDto): Promise<{ status: number; message: string; data: User }> {
    const FindUser = await this.userModule.findOne({_id:id})
    if (!FindUser) {
      throw new NotFoundException('User not found');
    }
    const ifUserExist = await this.userModule.findOne({
      email: updateUserDto.email
    });
    if (ifUserExist && ifUserExist._id.toString() !== id) {
      throw new HttpException('Email already exists', 400);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltOrRounds);
    }
    const updateData = { ...updateUserDto };
    delete updateData.email;
    return {
      status: 200,
      message: 'User updated successfully',
      data: await this.userModule.findByIdAndUpdate(id, updateUserDto,{new: true})
    };
   }

  async remove(id: string) {
    const deletedUser = await this.userModule.findByIdAndDelete(id).select('-password -__v');
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 200,
      message: 'User deleted successfully',
      data: deletedUser,
    };
  }
  // ====================== For User ========================
  async getMe(payload){
    console.log(payload._id);
    if (!payload._id) {
      throw new NotFoundException("User not found")
    }
    const user = await this.userModule.findById(payload._id).select('-password -__v');
    if (!user) {
      throw new NotFoundException('User Not Found')
    }
    return {
      status : 200,
      message: "User Found",
      data:user
    }

  }
  async updateMe(payload: any, updateUserDto: UpdateUserDto): Promise<{ status: number; message: string; data: User }> {
    const { _id } = payload;
    
    const user = await this.userModule.findById(_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.email) {
      const existingUser = await this.userModule.findOne({ email: updateUserDto.email });
      if (existingUser && existingUser._id.toString() !== _id) {
        throw new HttpException('Email already exists', 400);
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltOrRounds);
    }
  
    // Update the user
    const updatedUser = await this.userModule.findByIdAndUpdate(_id, updateUserDto, { new: true }).select('-password -__v');
    if (!updatedUser) {
      throw new NotFoundException('Error updating user');
    }
  
    return {
      status: 200,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }
  async deleteMe(payload: any): Promise<void> {
    const { _id } = payload;
    const user = await this.userModule.findById(_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Update the user
    const updatedUser = await this.userModule.findByIdAndUpdate(_id,{active:false},{new:true}).select('-password -__v');
    if (!updatedUser) {
      throw new NotFoundException('Error updating user');
    }
  }
  

}
