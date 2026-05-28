import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // 🔥 Ambil token
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Akses ditolak! Token tidak ada.');
    }

    try {
      // 🔥 Samain secret dengan AuthService
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'rahasia_kamu_disini'
      );

      // 🔥 Simpan user ke request (penting buat admin guard)
      request.user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token tidak valid!');
    }
  }
}