import {HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from './coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const existingCoupon = await this.couponModel.findOne({ name: createCouponDto.name });
    if (existingCoupon) {
      throw new HttpException('Coupon already exists', 400);
    }
    const coupon = await this.couponModel.create(createCouponDto);
    return {
      status: 201,
      message: 'Coupon created successfully',
      data: coupon,
    };
  }

  async findAll() {
    const coupons = await this.couponModel.find().select('-__v');
    return {
      status: 200,
      data: coupons,
    };
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return {
      status: 200,
      data: coupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponModel.findByIdAndUpdate(id, updateCouponDto, {
      new: true,
    }).select('-__v');
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return {
      status: 200,
      message: 'Coupon updated successfully',
      data: coupon,
    };
  }

  async remove(id: string) {
    const coupon = await this.couponModel.findByIdAndDelete(id).select('-__v');
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return {
      status: 200,
      message: 'Coupon deleted successfully',
    };
  }
}
