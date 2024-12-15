import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) {}

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto) {
    const categoryExists = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExists) {
      throw new HttpException('Category already exists', 400);
    }
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return {
      status: 200,
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  // Get all categories
  async findAll(query) {
    const {name} = query;
    const categories = await this.categoryModel.find().where('name',new RegExp(name,'i'));
    return {
      status: 200,
      length:categories.length,
      isEmpty:categories.length > 0 ? "false" : "true" ,
      data: categories,
    };
  }

  // Get a single category by ID
  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).select('-__v');
    if (!category) {
      throw new HttpException('Category not found', 404);
    }
    return {
      status: 200,
      data: category,
    };
  }

  // Update a category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true }
    );
    if (!updatedCategory) {
      throw new HttpException('Category not found', 404);
    }
    return {
      status: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  // Remove a category
  async remove(id: string) {
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw new HttpException('Category not found', 404);
    }
    return {
      status: 200,
      message: 'Category deleted successfully',
    };
  }
}

