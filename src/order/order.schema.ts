import { Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        color: { type: String,default: '' },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  })
  cartItems: { 
    productId: {
      _id: Types.ObjectId;
      price: number;
      priceAfterDiscount?: number;
    };
    quantity: number; color: string; price: number }[];

  @Prop({ type: Types.ObjectId, default: 0 })
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
    type: {
      alias: { type: String, required: true },
      details: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    required: true,
  })
  shippingAddress: {
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
