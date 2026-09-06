import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './challenge.entity.js';
import { ChallengeService } from './challenge.service.js';
import { ChallengeController } from './challenge.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge]), AuthModule],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
