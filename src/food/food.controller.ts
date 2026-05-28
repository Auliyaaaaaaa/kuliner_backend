import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards } from '@nestjs/common';
import { FoodService } from './food.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/foods')
@UseGuards(AuthGuard) // Semua endpoint di controller ini butuh login minimal (user/admin)
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  async getAll(@Query() query: any) {
    return this.foodService.getAllFoods(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.foodService.getFoodById(id);
  }

  @Post()
  @UseGuards(AdminGuard) // Hanya admin yang boleh tambah
  async create(@Body() body: any) {
    return this.foodService.createFood(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard) // Hanya admin yang boleh edit
  async update(@Param('id') id: string, @Body() body: any) {
    return this.foodService.updateFood(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard) // Hanya admin yang boleh hapus
  async delete(@Param('id') id: string) {
    return this.foodService.deleteFood(id);
  }
}
