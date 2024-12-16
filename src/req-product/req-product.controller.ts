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
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { RequestProductService } from './req-product.service';
import { CreateRequestProductDto } from './dto/create-req-product.dto';
import { UpdateRequestProductDto } from './dto/update-req-product.dto';

@Controller('v1/request-products')
export class RequestProductController {
  constructor(
    private readonly requestProductService: RequestProductService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['user'])
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true,whitelist:true }))
    createRequestProductDto: CreateRequestProductDto,@Req() req
  ) {
    if (req.user.role === "admin") {
      throw new UnauthorizedException();
    }
    return this.requestProductService.create(createRequestProductDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  findAll() {
    return this.requestProductService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['user', 'admin'])
  findOne(@Param('id') id: string,@Req() req) {
    return this.requestProductService.findOne(id,req);
  }
}
