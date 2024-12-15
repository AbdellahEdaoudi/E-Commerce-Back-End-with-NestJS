import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Coupon extends Document {
  @Prop({required: true})
  name: string;

  @Prop({ required: true, type: Date })
  expirdate: Date;

  @Prop({ required: true, min: 0 })
  discount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
