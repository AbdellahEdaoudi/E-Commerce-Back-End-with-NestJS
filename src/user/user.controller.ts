import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorator/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}))
   createUserDto: CreateUserDto ,@Req() req) {
    return this.userService.create(createUserDto,req.user);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
