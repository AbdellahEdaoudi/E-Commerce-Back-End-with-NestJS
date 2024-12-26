import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UnauthorizedException, NotFoundException, UseGuards, Query, RawBodyRequest, Headers } from '@nestjs/common';
import { OrderService } from './order.service';
import { AcceptOrderCashDto, CreateOrderDto } from './dto/create-order.dto';
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

  //  @docs   Admin Can Update Order payment cash
  //  @Route  PATCH /api/v1/cart/checkout/:orderId/cash
  //  @access Private [User]
  @Patch(':orderId/cash')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  updatePaidCash(
    @Param('orderId') orderId: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateOrderDto: AcceptOrderCashDto,
  ) {
    return this.orderService.updatePaidCash(orderId, updateOrderDto);
  }
}

@Controller('v1/checkout/session')
export class CheckoutCardController {
  constructor(private readonly orderService: OrderService) {}

  //  @docs   Webhook paid order true auto
  //  @Route  PATCH /api/v1/checkout/session
  //  @access Private [Stripe]
  @Post()
  updatePaidCard(
    @Headers('stripe-signature') sig,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const endpointSecret =
      'whsec_a0596a07de26dd710c7e9ea0d9da01f271ce4fa63924f62be78a918647e63c3f';

    const payload = request.rawBody;

    return this.orderService.updatePaidCard(payload, sig, endpointSecret);
  }
} 
