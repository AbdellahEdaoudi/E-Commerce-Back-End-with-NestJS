  // UpdateRequestProductDto
  import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestProductDto } from './create-req-product.dto';
  
  export class UpdateRequestProductDto extends PartialType(CreateRequestProductDto) {}
