import { Injectable, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  async create(createRequestProductDto: CreateRequestProductDto,req:any) {
    const reqproduct = await this.requestProductModel.findOne(
      { titleNeed: createRequestProductDto.titleNeed,
        user:req.user._id
      });
    if (reqproduct) {
      throw new HttpException('Request Product already exists', 400);
    }

    const user = await this.UserModel.findOne({_id:req.user._id})
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newRequest = await this.requestProductModel.create(
      {...createRequestProductDto,user:req.user._id},
    ).then((doc) => doc.populate('user', '-__v -role'));
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

  // Get one request by ID (Admin/User)
  async findOne(id: string,req:any) {
    const _idCreatedUser = req.user._id;
    const request = await this.requestProductModel
      .findById(id)
      .populate('user', '-password -__v -role')
      .select('-__v');
    if (!request) {
      throw new HttpException('Request not found', 404);
    }
    if (_idCreatedUser.toString() !== request.user._id.toString() && 
         req.user.role.toLowerCase() !== 'admin') {
      throw new UnauthorizedException();
    }
    return {
      status: 200,
      data: request,
    };
  }

  // Update a request (User only)
  async update(
    id: string,
    updateRequestProductDto: UpdateRequestProductDto,req:any
  ) {
    const _idUpdatedUser = req.user._id;
    const requestProduct = await this.requestProductModel.findById(id);
    if (!requestProduct) {
      throw new NotFoundException('Request not found');
    }
    if (_idUpdatedUser.toString() !== requestProduct.user.toString()) {
      throw new UnauthorizedException();
    }

    const updatedRequest = await this.requestProductModel.findByIdAndUpdate(
      id,
      {...updateRequestProductDto,user:req.user._id},
      { new: true },
    ).then((doc) => doc.populate('user', '-__v -role'));;
    return {
      status: 200,
      message: 'Request updated successfully',
      data: updatedRequest,
    };
  }

  // Delete a request (User only)
  async remove(id: string,req:any) {
    const requestProduct = await this.requestProductModel.findById(id);
    if (!requestProduct) {
      throw new NotFoundException('Request not found');
    }

    const _idDeletedUser = req.user._id;
    if (_idDeletedUser.toString() !== requestProduct.user.toString()) {
      throw new UnauthorizedException();
    }
    await this.requestProductModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Request deleted successfully',
    };
  }
}
