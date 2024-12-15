import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Brand extends Document {
  @Prop({ required: true, minlength: 3, maxlength: 100 })
  name: string;

  @Prop({ required: false })
  image: string; // URL field for image
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
