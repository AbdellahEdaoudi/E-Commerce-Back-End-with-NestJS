import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './order.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: Order.name,schema: OrderSchema},
      ]),
    ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
