import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestProduct } from './req-product.schema';
import { CreateRequestProductDto } from './dto/create-req-product.dto';
import { UpdateRequestProductDto } from './dto/update-req-product.dto';
import { User } from 'src/user/user.schema';

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name) private requestProductModel: Model<RequestProduct>,
    @InjectModel(User.name) private UserModel: Model<User>
  ) {}

  // Create a new request
  async create(createRequestProductDto: CreateRequestProductDto) {
    const reqproduct = await this.requestProductModel.findOne(
      { titleNeed: createRequestProductDto.titleNeed,
        user:createRequestProductDto.user
      });
    if (reqproduct) {
      throw new HttpException('Request Product already exists', 400);
    }

    const user = await this.UserModel.findOne({_id:createRequestProductDto.user})
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newRequest = await this.requestProductModel.create(
      createRequestProductDto,
    ).then((doc) => doc.populate('user', '-_id -__v -role'));
    return {
      status: 200,
      message: 'Request created successfully',
      data: newRequest,
    };
  }

  // Get all requests (Admin only)
  async findAll() {
    const requests = await this.requestProductModel
      .find()
      .populate('user', '-password -__v -role')
      .select('-__v');
    return {
      status: 200,
      length: requests.length,
      data: requests,
    };
  }
}
