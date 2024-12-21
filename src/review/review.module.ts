import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/product.schema';
import { Review, ReviewSchema } from './review.schema';
import { ReviewController, ReviewDashbourdController } from './review.controller';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ReviewController,ReviewDashbourdController],
  providers: [ReviewService],
})
export class ReviewModule {}