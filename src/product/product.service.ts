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

  async findAll(query: any) {
    // 1) filter
    // eslint-disable-next-line prefer-const
    let requestQuery = { ...query };
    const removeQuery = [
      'page',
      'limit',
      'sort',
      'keyword',
      'categoty',
      'fields',
    ];
    removeQuery.forEach((singelQuery) => {
      delete requestQuery[singelQuery];
    });
    requestQuery = JSON.parse(
      JSON.stringify(requestQuery).replace(
        /\b(gte|lte|lt|gt)\b/g,
        (match) => `$${match}`,
      ),
    );

    // 2) pagenation
    const page = query?.page || 1;
    const limit = query?.limit || 5;
    const skip = (page - 1) * limit;

    // 3) sorting
    // eslint-disable-next-line prefer-const
    let sort = query?.sort || 'asc';
    if (!['asc', 'desc'].includes(sort)) {
      throw new HttpException('Invalid sort', 400);
    }
    // 4) fields
    // eslint-disable-next-line prefer-const
    let fields = query?.fields || ''; // description,title
    fields = fields.split(',').join(' ');

    // 5) search
    // eslint-disable-next-line prefer-const
    let findData = { ...requestQuery };

    if (query.keyword) {
      findData.$or = [
        { title: { $regex: query.keyword } },
        { description: { $regex: query.keyword } },
      ];
    }
    if (query.category) {
      findData.category = query.category.toString();
    }

    const products = await this.productModel
      .find(findData)
      .limit(limit)
      .skip(skip)
      .sort({ title: sort })
      .select(fields);
    return {
      status: 200,
      message: 'Found Product',
      isEmpty: products.length > 0 ? 'false' : 'true',
      length: products.length,
      data: products,
    };
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
