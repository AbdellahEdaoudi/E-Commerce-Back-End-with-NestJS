import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';

@Controller('v1/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  async create(@Body(new ValidationPipe({ forbidNonWhitelisted: true }))
   createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin','user'])
  async findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin','user'])
  async findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  async update(@Param('id') id: string,
   @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  async remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
