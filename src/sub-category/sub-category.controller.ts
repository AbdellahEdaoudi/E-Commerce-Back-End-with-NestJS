import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCreateCategoryDto } from './dto/create-sub-category.dto';
import { SubUpdateCategoryDto } from './dto/update-sub-category.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';

@Controller('v1/subcategory')
export class SubCategoryController {
  constructor(private readonly SubcategoryService: SubCategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    SubcreateCategoryDto: SubCreateCategoryDto
  ) {
    return this.SubcategoryService.create(SubcreateCategoryDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['user','admin'])
  findAll() {
    return this.SubcategoryService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin','user'])
  findOne(@Param('id') id: string) {
    return this.SubcategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    SubupdateCategoryDto: SubUpdateCategoryDto
  ) {
    return this.SubcategoryService.update(id, SubupdateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.SubcategoryService.remove(id);
  }
}
