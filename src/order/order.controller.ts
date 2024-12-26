import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UnauthorizedException, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/user/decorator/roles.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';

@Controller('v1/cart/checkout')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(":paymentMethodType")
  @UseGuards(AuthGuard)
  @Roles(['user'])
  create(
    @Param("paymentMethodType") paymentMethodType:'card' | 'cash',@Req() req,@Query() query,
    @Body(new ValidationPipe({forbidNonWhitelisted:true,whitelist:true}))
     createOrderDto: CreateOrderDto) {
      if (req.user.role.toLowerCase() === 'admin') {
            throw new UnauthorizedException();
          }
      if (![ 'card', 'cash'].includes(paymentMethodType)) {
        throw new NotFoundException('Payment method not found');
      }
      const {
        success_url = "https://edaoudi-portfolio.vercel.app",
        cancel_url = "https://edaoudi-portfolio.vercel.app"} = query;
        const dataAfterPayment = {
          success_url,
          cancel_url,
        }
      const user_id = req.user._id;
    return this.orderService.create(user_id, paymentMethodType,createOrderDto,dataAfterPayment

    );
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
