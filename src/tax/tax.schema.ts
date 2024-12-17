import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tax extends Document {
  @Prop({ default: 0, type: Number })
  taxPrice: number;

  @Prop({ default: 0, type: Number })
  shippingPrice: number;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);
