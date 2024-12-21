import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

    const reviewsOnSingleProduct = await this.reviewModule
      .find({
        product: createReviewDto.product,
      })
      .select('rating');
    const ratingsQuantity = reviewsOnSingleProduct.length;
    if (ratingsQuantity > 0) {
      const totalRatings = reviewsOnSingleProduct.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const ratingsAverage = totalRatings / ratingsQuantity;

      await this.productModule.findByIdAndUpdate(createReviewDto.product, {
        ratingsAverage,
        ratingsQuantity,
      });
    }
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

  async findOne(user_id: string) {
    const reviews = await this.reviewModule
      .find({ user: user_id })
      .populate('user product', 'name role email title')
      .select('-__v');
    return {
      status: 200,
      message: 'Reviews Found',
      length: reviews.length,
      data: reviews,
    };
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    user_id: string,
  ) {
    const findReview = await this.reviewModule.findById(id);
    if (!findReview) {
      throw new NotFoundException('Not Found Review On this Id');
    }
    if (user_id.toString() !== findReview.user.toString()) {
      throw new UnauthorizedException();
    }
    const updateReview = await this.reviewModule
      .findByIdAndUpdate(
        id,
        {
          ...updateReviewDto,
          user: user_id,
          product: updateReviewDto.product,
        },
        { new: true },
      ).select('-__v');

      const reviewsOnSingleProduct = await this.reviewModule
      .find({
        product: findReview.product,
      })
      .select('rating');
    const ratingsQuantity = reviewsOnSingleProduct.length;
    if (ratingsQuantity > 0) {
      const totalRatings = reviewsOnSingleProduct.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const ratingsAverage = totalRatings / ratingsQuantity;

      await this.productModule.findByIdAndUpdate(findReview.product, {
        ratingsAverage,
        ratingsQuantity,
      });
    }

    return {
      status: 200,
      message: 'Review Updated successfully',
      data: updateReview,
    };
  }

  async remove(id: string, user_id: string): Promise<void> {
    const findReview = await this.reviewModule.findById(id);

    if (!findReview) {
      throw new NotFoundException('Not Found Review On this Id');
    }
    if (user_id.toString() !== findReview.user.toString()) {
      throw new UnauthorizedException();
    }
    await this.reviewModule.findByIdAndDelete(id);

    const reviewsOnSingleProduct = await this.reviewModule
      .find({
        product: findReview.product,
      })
      .select('rating');
    const ratingsQuantity = reviewsOnSingleProduct.length;
    if (ratingsQuantity > 0) {
      const totalRatings = reviewsOnSingleProduct.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const ratingsAverage = totalRatings / ratingsQuantity;

      await this.productModule.findByIdAndUpdate(findReview.product, {
        ratingsAverage,
        ratingsQuantity,
      });
    }else {
      await this.productModule.findByIdAndUpdate(findReview.product, {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      });
    }
  }
}
