import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreakService } from './streak.service.js';
import { StreakController } from './streak.controller.js';
import { Photo } from '../photo/photo.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), AuthModule],
  controllers: [StreakController],
  providers: [StreakService],
})
export class StreakModule {}
