import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './suppliers.schema';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
  ) {}

  // Create a new supplier
  async create(createSupplierDto: CreateSupplierDto) {
    const supplierExists = await this.supplierModel.findOne({
      name: createSupplierDto.name,
    });
    if (supplierExists) {
      throw new HttpException('Supplier already exists', 400);
    }

    const newSupplier = await this.supplierModel.create(createSupplierDto);
    return {
      status: 200,
      message: 'Supplier created successfully',
      data: newSupplier,
    };
  }

  // Get all suppliers
  async findAll() {
    const suppliers = await this.supplierModel.find().select('-__v');
    return {
      status: 200,
      length: suppliers.length,
      isEmpty: suppliers.length > 0 ? 'false' : 'true',
      data: suppliers,
    };
  }

  // Get a single supplier by ID
  async findOne(id: string) {
    const supplier = await this.supplierModel.findById(id).select('-__v');
    if (!supplier) {
      throw new HttpException('Supplier not found', 404);
    }
    return {
      status: 200,
      data: supplier,
    };
  }

  // Update a supplier
  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const updatedSupplier = await this.supplierModel.findByIdAndUpdate(
      id,
      updateSupplierDto,
      { new: true },
    ).select('-__v');
    if (!updatedSupplier) {
      throw new HttpException('Supplier not found', 404);
    }
    return {
      status: 200,
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    };
  }

  // Remove a supplier
  async remove(id: string) {
    const deletedSupplier = await this.supplierModel.findByIdAndDelete(id);
    if (!deletedSupplier) {
      throw new HttpException('Supplier not found', 404);
    }
    return {
      status: 200,
      message: 'Supplier deleted successfully',
    };
  }
}
