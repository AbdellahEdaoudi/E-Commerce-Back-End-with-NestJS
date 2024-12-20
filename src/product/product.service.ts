import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.schema';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}
  async create(createProductDto: CreateProductDto) {
    const findProduct = await this.productModel.findOne({title:createProductDto.title});
    if (findProduct) {
      throw new HttpException('Product with this title already exists', 400);
    }
    const product = await this.productModel.create(createProductDto);
    return { status: 201, message: 'Product created successfully', data: product };
  }

  async findAll(query) {
    const products = await this.productModel.find(query).populate('category subCategory brand','-__v');
    return { status: 200, length: products.length, data: products };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).populate('category subCategory brand','-__v');
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    return { status: 200, data: product };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    return { status: 200, message: 'Product updated successfully', data: product };
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    return { status: 200, message: 'Product deleted successfully' };
  }
}
