import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Brand } from './brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    // Check if a brand with the same name already exists
    const existingBrand = await this.brandModel.findOne({ name: createBrandDto.name });
    if (existingBrand) {
      throw new ConflictException('A brand with this name already exists');
    }

    const brand = await this.brandModel.create(createBrandDto);
    return {
      status: 201,
      message: 'Brand created successfully',
      data: brand,
    };
  }

  async findAll() {
    const brands = await this.brandModel.find().select('-__v');
    return {
      status: 200,
      data: brands,
    };
  }
  

  async findOne(id: string) {
    // Validate the id
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const brand = await this.brandModel.findById(id).select('-__v');
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return {
      status: 200,
      data: brand,
    };
  }
  

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    // Validate the id
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const brand = await this.brandModel.findByIdAndUpdate(id, updateBrandDto, {
      new: true,
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return {
      status: 200,
      message: 'Brand updated successfully',
      data: brand,
    };
  }

  async remove(id: string) {
    const brand = await this.brandModel.findByIdAndDelete(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return {
      status: 200,
      message: 'Brand deleted successfully',
    };
  }
}
