import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from './suppliers.schema';
import { SupplierController } from './suppliers.controller';
import { SupplierService } from './suppliers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supplier.name, schema: SupplierSchema }]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
