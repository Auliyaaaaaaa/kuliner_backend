import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll() {
    return this.categoryService.getAllCategories();
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body('name') name: string) {
    return this.categoryService.createCategory(name);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
