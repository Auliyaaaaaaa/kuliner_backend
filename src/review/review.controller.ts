import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/reviews')
@UseGuards(AuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  // SHOW ALL (admin only)
  @Get()
  @UseGuards(AdminGuard)
  async getAll() {
    return this.reviewService.getAllReviews();
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return this.reviewService.createReview(req.user.id, body);
  }

  @Get('food/:foodId')
  async getByFood(@Param('foodId') foodId: string) {
    return this.reviewService.getReviewsByFood(foodId);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await this.reviewService.deleteReview(id, userId, userRole);
    return result;
  }
}