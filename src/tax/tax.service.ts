import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { Tax } from './tax.schema';

@Injectable()
export class TaxService {
  constructor(
    @InjectModel(Tax.name) private readonly taxModel: Model<Tax>,
  ) {}

  async createOrupdate(createTaxDto: CreateTaxDto) {
    // Check if a tax entry with the same details already exists
    const Tax = await this.taxModel.findOne({});
    if (!Tax) {
      const newTax = await this.taxModel.create(createTaxDto);
      return {
        status:200,
        message:"Tax Created Successfully",
        data:newTax
      }
    }
    const updateTex =  await this.taxModel.findOneAndUpdate({},createTaxDto,{new:true}).select('-__v');
    if (updateTex) {
      return {
        status: 201,
        message: 'Tax  Updated successfully',
        data: updateTex,
      };
    }
  }

  async find() {
    const taxes = await this.taxModel.findOne({}).select('-__v');
    return {
      status: 200,
      data: taxes,
    };
  }

  async ReSet():Promise<void>{
    await this.taxModel.findOneAndUpdate({},{taxPrice:0,shippingPrice:0});
  }
}
