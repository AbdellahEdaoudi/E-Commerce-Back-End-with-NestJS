import { Module } from '@nestjs/common';
import { RequestProduct, RequestProductSchema } from './req-product.schema';
import { RequestProductController } from './req-product.controller';
import { RequestProductService } from './req-product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestProduct.name, schema: RequestProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}
