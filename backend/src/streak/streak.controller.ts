import { Controller, Get, UseGuards } from '@nestjs/common';
import { StreakService } from './streak.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtUser } from '../auth/jwt.strategy.js';

@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getStreak(
    @CurrentUser() user: JwtUser,
  ): Promise<{ streak: number; dates: string[] }> {
    return this.streakService.getStreak(user.userId);
  }
}
