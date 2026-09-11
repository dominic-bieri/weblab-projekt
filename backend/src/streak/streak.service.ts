import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../photo/photo.entity.js';
import { calculateStreakDates } from './streak.util.js';

@Injectable()
export class StreakService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async getStreak(
    userId: string,
  ): Promise<{ streak: number; dates: string[] }> {
    const photos = await this.photoRepository.find({
      where: { userId },
      select: { captureDate: true },
    });
    const dates = calculateStreakDates(
      photos.map((photo) => photo.captureDate),
    );
    return { streak: dates.length, dates };
  }
}
