import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategory, SubCategorySchema } from './sub-category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Category.name, schema: CategorySchema }
    ])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
