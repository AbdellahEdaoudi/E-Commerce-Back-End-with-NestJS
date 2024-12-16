import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RequestProductDocument = HydratedDocument<RequestProduct>;

@Schema({ timestamps: true })
export class RequestProduct {
  @Prop({
    type: String,
    required: [true, 'Title is required'],
  })
  titleNeed: string;

  @Prop({
    type: String,
    required: [true, 'Details are required'],
    minlength: [5, 'Details must be at least 5 characters long'],
  })
  details: string;

  @Prop({
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  })
  qauntity: number;

  @Prop({
    type: String,
    required: false,
  })
  category?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  })
  user: Types.ObjectId;
}

export const RequestProductSchema = SchemaFactory.createForClass(RequestProduct);
