import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: [
      { 
        productId: { type: Types.ObjectId, ref: 'Product' }, 
        quantity: Number, 
        color: String, 
        price: Number 
      }
    ], 
    required: true 
  })
  cartItems: { productId: Types.ObjectId; quantity: number; color: string; price: number }[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Number })
  totalPriceAfterDiscount: number;

  @Prop({
    type: [
      {
        name: { type: String },
        couponId: { type: mongoose.Schema.Types.ObjectId, ref: Coupon.name },
      },
    ],
    default: [],
  })
  coupons: { name: string; couponId: string }[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
