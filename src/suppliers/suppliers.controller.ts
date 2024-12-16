import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { SupplierService } from './suppliers.service';

@Controller('v1/suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createSupplierDto: CreateSupplierDto,
  ) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['user', 'admin'])
  findAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['user', 'admin'])
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
