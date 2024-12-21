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

  @Get(":id")
  findAll(@Param('id') id: string) {
    return this.reviewService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
