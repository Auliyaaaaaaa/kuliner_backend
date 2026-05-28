import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Register customer (public)
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  // Register admin (public - untuk setup awal)
  @Post('register-admin')
  async registerAdmin(@Body() body: any) {
    return this.authService.registerAdmin(body);
  }

  // Login (public)
  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }
}