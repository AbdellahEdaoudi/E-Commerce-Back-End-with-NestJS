import mongoose, { Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Product } from 'src/product/product.schema';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user: typeof User;
  @Prop({
    type: String,
    required: false,
  })
  sessionId: string;
  @Prop({
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          ref: Product.name,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          default: '',
        },
      },
    ],
  })
  cartItems: [
    {
      productId: {
        _id: string;
        price: number;
        priceAfterDiscount: number;
      };
      quantity: number;
      color: string;
    },
  ];


  @Prop({ type: Number, default: 0 })
  tax: number;

  @Prop({ type: Number, default: 0 })
  shippingPrice: number;

  @Prop({ type: Number, required: true })
  totalOrderPrice: number;

  @Prop({ type: String, enum: ['cash', 'card'],default: "card",required: false })
  paymentMethodType: string;

  @Prop({ type: Boolean, default: false })
  isPaid: boolean;

  @Prop({ type: Date, required: false })
  paidAt: Date;

  @Prop({ type: Boolean, default: false, required: false })
  isDeliverd: boolean;

  @Prop({ type: Date, required: false })
  deliverdAt: Date;

  @Prop({
    type: String,
    required: false,
  })
  shippingAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
