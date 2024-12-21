import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, ValidationPipe, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';

@Controller('v1/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['user'])
  create(@Body(new ValidationPipe({ forbidNonWhitelisted: true })) 
  createReviewDto: CreateReviewDto,@Req() req) {
    if (req.user.role === "admin") {
          throw new UnauthorizedException();
        }
    return this.reviewService.create(createReviewDto,req.user._id);
  }
  //  @docs   Any User Can Get All Reviews On Product
  //  @Route  GET /api/v1/review
  //  @access Public
  @Get(":id")
  findAll(@Param('id') id: string) {
    return this.reviewService.findAll(id);
  }

  @Patch(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
    updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }
    const user_id = req.user._id;
    return this.reviewService.update(id, updateReviewDto, user_id);
  }

  @Delete(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new UnauthorizedException();
    }
    const user_id = req.user._id;
    return this.reviewService.remove(id, user_id);
  }
}


@Controller('v1/dashbourd/review')
export class ReviewDashbourdController {
  constructor(private readonly reviewService: ReviewService) {}
  @Get(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') user_id: string) {
    return this.reviewService.findOne(user_id);
  }
}