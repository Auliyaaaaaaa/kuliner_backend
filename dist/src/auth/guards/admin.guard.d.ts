import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
export declare class AdminGuard extends AuthGuard {
    canActivate(context: ExecutionContext): boolean;
}
