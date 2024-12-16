import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name must be at most 50 characters'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Website is required'],
    validate: {
      validator: (v: string) => /^https?:\/\/.+/.test(v),
      message: 'Invalid website URL',
    },
  })
  website: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
