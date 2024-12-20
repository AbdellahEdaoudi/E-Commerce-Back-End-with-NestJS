import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true, minlength: 3 })
  title: string;

  @Prop({ type: String, required: true, minlength: 20 })
  description: string;

  @Prop({ type: Number, required: true, min: 1, max: 500, default: 0 })
  quantity: number;

  @Prop({ type: String, required: true })
  imageCover: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({ type: Number, required: true, min: 1, max: 20000 })
  price: number;

  @Prop({ type: Number, min: 1, max: 20000 })
  priceAfterDiscount: number;

  @Prop({ type: [String], default: [] })
  colors: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' })
  subCategory: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
  brand: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  ratingsAverage: number;

  @Prop({ type: Number, default: 0 })
  ratingsQuantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
