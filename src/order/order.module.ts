import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/cart/cart.schema';
import { Tax, TaxSchema } from 'src/tax/tax.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: Order.name,schema: OrderSchema},
        {name:Cart.name,schema:CartSchema},
        { name: Tax.name, schema: TaxSchema }
      ]),
    ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
