import { Injectable, NotFoundException } from '@nestjs/common';
import { AcceptOrderCashDto, CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Tax } from 'src/tax/tax.schema';
import { User } from 'src/user/user.schema';
import { Product } from 'src/product/product.schema';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(
  `sk_test_51QZyAIDvfMS2Q0DTGoGVmDnO5JzvYlIlAJj3orWzdnjNgyqmqdfzGR5fPl7ece7KDbosoy52eHpP0u26DstwktEH00ZyVGYv7A`
);

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
          await this.cartModule.findOneAndUpdate({ user: user_id }, 
            { cartItems: [],totalPriceAfterDiscount:0,totalPrice:0}, { new: true });
          if (data.totalOrderPrice === 0) {
            cart.cartItems.forEach(async (item)=>{
              await this.productModel.findByIdAndUpdate(item.productId._id, {
                $inc: { quantity: -item.quantity,sold:item.quantity }
              },{ new: true });
            })
          }
        return {
          status: 200,
          message: 'Order created successfully',
          data: order,
        }
     }
     const line_items = cart.cartItems.map(({productId,color}) => {
      return {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(data.totalOrderPrice * 100),
          product_data: {
            name: productId.title,
            description: productId.description,
            images: [productId.imageCover, ...productId?.images],
            metadata: {
              color,
            }
          },
        },
        quantity:1,
      };
    });

    // Stripe payment
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: dataAfterPayment.success_url,
      cancel_url: dataAfterPayment.cancel_url,
  
      client_reference_id: user_id.toString(),
      customer_email: cart.user.email,
      metadata: {
        address: data.shippingAddress,
      },
    });
    // insert order   in database
    const order = await this.OrderModule.create(
      { 
        ...data,
        sessionId : session.id,
        isPaid:data.totalOrderPrice === 0 ? true : false,
        paidAt:data.totalOrderPrice === 0 ? new Date() : undefined,
        isDeliverd:false
      });
    
    return {
      status: 200,
      message: 'Order created successfully',
      data: {
        url: session.url,
        success_url: `${session.success_url}?session_id=${session.id}`,
        cuncel_url: session.cancel_url,
        expires_at: new Date(session.expires_at * 1000),
        sessionId: session.id,
        totalPrice:session.amount_total,
        data: order,
      },
    }
    }
  
    async updatePaidCash(orderId: string, updateOrderDto: AcceptOrderCashDto) {
      const order = await this.OrderModule.findById(orderId);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
  
      if (order.paymentMethodType !== 'cash') {
        throw new NotFoundException('This order not paid by cash');
      }
  
      if (order.isPaid) {
        throw new NotFoundException('Order already paid');
      }
  
      if (updateOrderDto.isPaid) {
        updateOrderDto.paidAt = new Date();
        const cart = await this.cartModule
          .findOne({ user: order.user.toString() })
          .populate('cartItems.productId user');
        cart.cartItems.forEach(async (item) => {
          await this.productModel.findByIdAndUpdate(
            item.productId,
            { $inc: { quantity: -item.quantity, sold: item.quantity } },
            { new: true },
          );
        });
        // reset Cart
        await this.cartModule.findOneAndUpdate(
          { user: order.user.toString() },
          { cartItems: [], totalPrice: 0 },
        );
      }
  
      if (updateOrderDto.isDeliverd) {
        updateOrderDto.deliverdAt = new Date();
      }
  
      const updatedOrder = await this.OrderModule.findByIdAndUpdate(
        orderId,
        { ...updateOrderDto },
        { new: true },
      );
  
      return {
        status: 200,
        message: 'Order updated successfully',
        data: updatedOrder,
      };
    }

    async updatePaidCard(payload: any, sig: any, endpointSecret: string) {
      let event;
  
      try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        return;
      }
  
      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const sessionId = event.data.object.id;
  
          const order = await this.OrderModule.findOne({ sessionId });
          order.isPaid = true;
          order.isDeliverd = true;
          order.paidAt = new Date();
          order.deliverdAt = new Date();
  
          const cart = await this.cartModule
            .findOne({ user: order.user.toString() })
            .populate('cartItems.productId user');
  
          cart.cartItems.forEach(async (item) => {
            await this.productModel.findByIdAndUpdate(
              item.productId,
              { $inc: { quantity: -item.quantity, sold: item.quantity } },
              { new: true },
            );
          });
  
          // reset Cart
          await this.cartModule.findOneAndUpdate(
            { user: order.user.toString() },
            { cartItems: [], totalPrice: 0 },
          );
  
          await order.save();
          await cart.save();
  
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    }

    async findAllOrdersOnUser(user_id: string) {
      const orders = await this.OrderModule.find({ user: user_id });
      return {
        status: 200,
        message: 'Orders found',
        length: orders.length,
        data: orders,
      };
    }

    async findAllOrders() {
      const orders = await this.OrderModule.find({});
      return {
        status: 200,
        message: 'Orders found',
        length: orders.length,
        data: orders,
      };
    }

}
