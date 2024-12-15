import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';

@Controller('v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCategoryDto: CreateCategoryDto
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['user','admin'])
  findAll(@Query() query) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin','user'])
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
