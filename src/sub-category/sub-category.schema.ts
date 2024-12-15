  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Category } from 'src/category/category.schema';

  export type SubCategoryDocument = HydratedDocument<SubCategory>;
  @Schema({ timestamps: true })
  export class SubCategory {
    @Prop({
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [30, 'Name must be at most 30 characters'],
    })
    name:string;
    @Prop({
      type: mongoose.Schema.Types.ObjectId,
      ref: Category.name,
      required: [true, 'SubCategory is required'],
    })
    category: Types.ObjectId;
  }
  
  export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
