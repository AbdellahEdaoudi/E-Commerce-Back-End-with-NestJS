import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Tax } from 'src/tax/tax.schema';
import { User } from 'src/user/user.schema';
import { Product } from 'src/product/product.schema';

@Injectable()
export class OrderService {
  constructor (
    @InjectModel(Order.name) private OrderModule:Model<Order>,
    @InjectModel(Cart.name) private cartModule:Model<Cart>,
    @InjectModel(Tax.name) private taxModule:Model<Tax>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
) {}

  async create(user_id:string,paymentMethodType: 'card' | 'cash',
    createOrderDto: CreateOrderDto,dataAfterPayment:{success_url:string,cancel_url:string}
  ) {
    const cart = await this.cartModule.findOne({ user: user_id })
  .populate('cartItems.productId', 'price priceAfterDiscount title description imageCover images')
  .populate<{ user: User }>('user', 'address email');
    if (!cart) {
      throw new NotFoundException("Cart not found")
    }
    const tax = await this.taxModule.findOne({})
    const shippingAddress = cart.user.address || createOrderDto.shippingAddress;

    const data = {
      user:user_id,
      cartItems:cart.cartItems,
      tax:tax.taxPrice || 0,
      shippingPrice:tax.shippingPrice || 0,
      totalOrderPrice: (cart.totalPrice + tax.taxPrice || 0) + (tax.shippingPrice || 0),
      paymentMethodType,
      shippingAddress
    }
    if (paymentMethodType === "cash") {
      const order = await this.OrderModule.create(
        {...data,
          isPaid:data.totalOrderPrice === 0 ? true : false,
          paidAt:data.totalOrderPrice === 0 ? new Date() : undefined,
          isDeliverd:false});
          await this.cartModule.findOneAndUpdate({ user: user_id }, { cartItems: [],totalPriceAfterDiscount:0,totalPrice:0}, { new: true })
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
