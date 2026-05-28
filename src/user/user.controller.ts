import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('api/users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  // ========================
  // ADMIN - Kelola semua admin
  // ========================

  // GET semua admin (Admin only)
  @Get('admins')
  @UseGuards(AdminGuard)
  async getAllAdmins() {
    return this.userService.getAllAdmins();
  }

  // GET detail admin by ID (Admin only)
  @Get('admins/:id')
  @UseGuards(AdminGuard)
  async getAdminById(@Param('id') id: string) {
    return this.userService.getAdminById(id);
  }

  // DELETE hapus admin (Admin only)
  @Delete('admins/:id')
  @UseGuards(AdminGuard)
  async deleteAdmin(@Param('id') id: string) {
    return this.userService.deleteAdmin(id);
  }

  // PUT update admin (Admin only)
  @Put('admins/:id')
  @UseGuards(AdminGuard)
  async updateAdmin(@Param('id') id: string, @Body() body: any) {
    return this.userService.updateAdmin(id, body);
  }

  // ========================
  // ADMIN - Kelola semua customer
  // ========================

  // GET semua customer (Admin only)
  @Get('customers')
  @UseGuards(AdminGuard)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  // GET detail customer by ID (Admin only)
  @Get('customers/:id')
  @UseGuards(AdminGuard)
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // DELETE hapus customer (Admin only)
  @Delete('customers/:id')
  @UseGuards(AdminGuard)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  // ========================
  // CUSTOMER - Kelola profil sendiri
  // ========================

  // GET profil sendiri
  @Get('me/profile')
  async getMyProfile(@Req() req: any) {
    return this.userService.getMyProfile(req.user.id);
  }

  // PUT update profil sendiri (customer only)
  @Put('me/profile')
  async updateMyProfile(@Req() req: any, @Body() body: any) {
    return this.userService.updateMyProfile(req.user.id, body);
  }
}