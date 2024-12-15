import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';

@Controller('v1/coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(@Body(new ValidationPipe({ forbidNonWhitelisted: true })) createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(@Param('id') id: string, 
  @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
   updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
