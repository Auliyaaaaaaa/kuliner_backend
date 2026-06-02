import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { FoodService } from './food.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/foods')
@UseGuards(AuthGuard)
export class FoodController {
  constructor(private readonly foodService: FoodService) { }

  @Get()
  async getAll(@Query() query: any) {
    return this.foodService.getAllFoods(query);
  }

  @Get('pending')
  @UseGuards(AdminGuard)
  async getPending() {
    return this.foodService.getPendingFoods();
  }

  @Get('my-submissions')
  async getMySubmissions(@Req() req: any) {
    return this.foodService.getMySubmissions(req.user.id);
  }
  @Get('all-submissions')
  @UseGuards(AdminGuard)
  async getAllSubmissions() {
    return this.foodService.getAllSubmissions();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.foodService.getFoodById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: any) {
    return this.foodService.createFood(body);
  }

  @Post('submit')
  async submit(@Body() body: any, @Req() req: any) {
    return this.foodService.submitFood(body, req.user.id);
  }

  @Put(':id/approve')
  @UseGuards(AdminGuard)
  async approve(@Param('id') id: string) {
    return this.foodService.approveFood(id);
  }

  @Put(':id/reject')
  @UseGuards(AdminGuard)
  async reject(@Param('id') id: string) {
    return this.foodService.rejectFood(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.foodService.updateFood(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    return this.foodService.deleteFood(id);
  }
}