import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { JwtUser } from '../src/auth/jwt.strategy.js';

@Injectable()
export class FakeAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    if (typeof userId !== 'string' || userId.length === 0) {
      return false;
    }

    const user: JwtUser = {
      userId,
      username: userId,
      email: `${userId}@test.local`,
    };
    request.user = user;
    return true;
  }
}
