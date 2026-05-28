import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminGuard extends AuthGuard {
  canActivate(context: ExecutionContext): boolean {
    // 🔥 langsung jalankan AuthGuard (kalau gagal, otomatis error)
    super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 🔥 cek role
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Akses ditolak! Hanya admin yang bisa melakukan ini.');
    }

    return true;
  }
}