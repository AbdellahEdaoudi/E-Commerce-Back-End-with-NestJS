import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorator/roles.decorator';

@Controller('/v1/user') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}))
   createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

}


@Controller('/v1/userMe') 
export class UserMEController {
  constructor(private readonly userService: UserService) {}
  
  // for User
  @Get()
  @Roles(['admin',"user"])
  @UseGuards(AuthGuard)
  getMe(@Req() req:any){
    console.log(req.user);
    return this.userService.getMe(req.user);
  }
  // Update User
  @Patch()
  @UseGuards(AuthGuard)
  @Roles(['user', 'admin'])
  updateMe(@Req() req: any, @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateUserDto: UpdateUserDto) {
    return this.userService.updateMe(req.user, updateUserDto);
  }

  // Delete User
  @Patch("delete")
  @UseGuards(AuthGuard)
  @Roles(['user'])
  deleteMe(@Req() req: any) {
    return this.userService.deleteMe(req.user);
  }
}
