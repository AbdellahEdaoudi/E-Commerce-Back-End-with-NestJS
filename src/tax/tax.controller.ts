import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';

@Controller('v1/taxes')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  async createOrupdate(@Body(new ValidationPipe({ forbidNonWhitelisted: true })) createTaxDto: CreateTaxDto) {
    return this.taxService.createOrupdate(createTaxDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  async find() {
    return this.taxService.find();
  }


  @Delete('')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  async ReSet() {
    return this.taxService.ReSet();
  }
}
