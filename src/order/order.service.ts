import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Tax } from 'src/tax/tax.schema';

@Injectable()
export class OrderService {
  constructor (
    @InjectModel(Order.name) private OrderModel:Model<Order>,
    @InjectModel(Cart.name) private cartModel:Model<Cart>,
    @InjectModel(Tax.name) private taxModel:Model<Tax>,
) {}

  async create(user_id:string,paymentMethodType: 'card' | 'cash',
    createOrderDto: CreateOrderDto
  ) {
    const cart = await (await this.cartModel.findOne({ user: user_id }))
    .populated('cartItems.productId user')
    if (!cart) {
      throw new Error('Cart not found')
    }
    const tax = await this.taxModel.findOne({})

    let data = {
      user:user_id,
      cartItems:cart.cartItems,
      tax:tax.taxPrice,
      shippingPrice:tax.shippingPrice,
      totalOrderPrice:cart.totalPrice + tax.taxPrice + tax.shippingPrice,
      paymentMethodType,
      shippingAddress:cart.user.address ??  createOrderDto.shippingAddress,
    }
    if (paymentMethodType) {
      const order = await this.OrderModel.create(
        {...data, isPaid:false,isDeliverd:false});
        return {
          status: 200,
          message: 'Order created successfully',
          data: order,
        }
     }
     
    }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
