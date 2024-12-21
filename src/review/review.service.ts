import { HttpException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModule: Model<Review>,
    @InjectModel(Product.name) private readonly productModule: Model<Product>,
  ) {}
  
  async create(createReviewDto: CreateReviewDto, user_id: string) {
    const review = await this.reviewModule.findOne({
      user: user_id,
      product: createReviewDto.product,
    });

    if (review) {
      throw new HttpException(
        'This User already Created Review On this Product',
        400,
      );
    }

    const newReview = await (
      await this.reviewModule.create({
        ...createReviewDto,
        user: user_id,
      })
    ).populate('product user', 'name email title description imageCover');
    return {
      status: 200,
      message: 'Review Created successfully',
      data: newReview,
    };
  }

  async findAll(prodcut_id: string) {
    const reviews = await this.reviewModule
      .find({ product: prodcut_id })
      .populate('user product', 'name email title')
      .select('-__v');
    return {
      status: 200,
      message: 'Reviews Found',
      length: reviews.length,
      data: reviews,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
