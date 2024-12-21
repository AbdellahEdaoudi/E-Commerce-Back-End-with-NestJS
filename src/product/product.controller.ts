import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(@Param('id') id: string,
   @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}


  /*
     {
       "gte"  === > [>or=]
       "gt"  === > [>]
       "lte"  === > [<or=]
       "lt"  === > [<]
     }
  */
