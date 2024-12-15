  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { HydratedDocument } from 'mongoose';

  export type CategoryDocument = HydratedDocument<Category>;
  @Schema({ timestamps: true })
  export class Category {
    @Prop({
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [30, 'Name must be at most 30 characters'],
    })
    name: string;
  
    @Prop({
      type: String,
    })
    image?: string;
  }
  
  export const CategorySchema = SchemaFactory.createForClass(Category);
