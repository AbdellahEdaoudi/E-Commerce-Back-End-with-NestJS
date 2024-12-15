import { HttpException, Injectable } from '@nestjs/common';
import { SubCreateCategoryDto } from './dto/create-sub-category.dto';
import { SubUpdateCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './sub-category.schema';
import { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>, 
    @InjectModel(Category.name) private CategoryModel: Model<Category>) {}

  // Create a new category
  async create(SubcreateCategoryDto: SubCreateCategoryDto) {
    const SubcategoryExists = await this.subCategoryModel.findOne({
      name: SubcreateCategoryDto.name,
    });
    if (SubcategoryExists) {
      throw new HttpException('SubCategory already exists', 400);
    }
    const CategorySubcategory = await this.CategoryModel.findOne({
      _id: SubcreateCategoryDto.category,
    });
    if (!CategorySubcategory) {
      throw new HttpException('Category not found', 404);
    }
    const newSubCategory = await this.subCategoryModel
    .create(SubcreateCategoryDto)
    .then((doc) => doc.populate('category', '-_id -__v'));
    
    return {
      status: 200,
      message: 'SubCategory created successfully',
      data: newSubCategory,
    };
  }

  // Get all categories
  async findAll() {
    const subcategories = await this.subCategoryModel.find().select('-__v').populate('category','-_id -__v ');
    return {
      status: 200,
      length:subcategories.length,
      isEmpty:subcategories.length > 0 ? "false" : "true" ,
      data: subcategories,
    };
  }

  // Get a single category by ID
  async findOne(id: string) {
    const subcategories = await this.subCategoryModel.findById(id).select('-__v').populate('category','-_id -__v ');
    if (!subcategories) {
      throw new HttpException('SubCategory not found', 404);
    }
    return {
      status: 200,
      data: subcategories,
    };
  }

  // Update a category
  async update(id: string, SubupdateCategoryDto: SubUpdateCategoryDto) {
    const SubupdatedCategory = await this.subCategoryModel.findByIdAndUpdate(
      id,
      SubupdateCategoryDto,
      { new: true }
    ).select('-__v');
    if (!SubupdatedCategory) {
      throw new HttpException('SubCategory not found', 404);
    }
    return {
      status: 200,
      message: 'SubCategory updated successfully',
      data: SubupdatedCategory,
    };
  }

  // Remove a category
  async remove(id: string) {
    const SubdeletedCategory = await this.subCategoryModel.findByIdAndDelete(id);
    if (!SubdeletedCategory) {
      throw new HttpException('SubCategory not found', 404);
    }
    return {
      status: 200,
      message: 'SubCategory deleted successfully',
    };
  }
}

