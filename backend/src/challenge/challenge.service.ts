import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from './challenge.entity.js';
import { ChallengeDto } from './challenge.dto.js';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  createChallenge(userId: string, dto: ChallengeDto): Promise<Challenge> {
    const { startDate, endDate } = this.parseDateRange(dto);

    return this.challengeRepository.save(
      this.challengeRepository.create({
        id: randomUUID(),
        userId,
        title: this.parseTitle(dto.title),
        description: this.parseDescription(dto.description),
        startDate,
        endDate,
      }),
    );
  }

  findAll(userId: string): Promise<Challenge[]> {
    return this.challengeRepository.find({
      where: { userId },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Challenge> {
    const challenge = await this.challengeRepository.findOneBy({ id, userId });
    if (!challenge) {
      throw new NotFoundException(`Challenge ${id} not found`);
    }
    return challenge;
  }

  async updateChallenge(
    id: string,
    userId: string,
    dto: ChallengeDto,
  ): Promise<Challenge> {
    await this.assertOwnership(id, userId);
    const { startDate, endDate } = this.parseDateRange(dto);

    const changes: Partial<Challenge> = {
      title: this.parseTitle(dto.title),
      description: this.parseDescription(dto.description),
      startDate,
      endDate,
    };

    const challenge = await this.challengeRepository.preload({
      id,
      ...changes,
    });
    if (!challenge) {
      throw new NotFoundException(`Challenge ${id} not found`);
    }
    return this.challengeRepository.save(challenge);
  }

  async deleteChallenge(id: string, userId: string): Promise<void> {
    await this.assertOwnership(id, userId);
    await this.challengeRepository.delete(id);
  }

  private async assertOwnership(id: string, userId: string): Promise<void> {
    const owned = await this.challengeRepository.existsBy({ id, userId });
    if (!owned) {
      throw new NotFoundException(`Challenge ${id} not found`);
    }
  }

  private parseTitle(value: string): string {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new BadRequestException('title is required');
    }
    return trimmed;
  }

  private parseDescription(value: string): string {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new BadRequestException('description is required');
    }
    return trimmed;
  }

  private parseDateRange(dto: ChallengeDto): {
    startDate: string;
    endDate: string;
  } {
    const startDate = this.parseDate(dto.startDate, 'startDate');
    const endDate = this.parseDate(dto.endDate, 'endDate');
    if (endDate < startDate) {
      throw new BadRequestException('endDate must not be before startDate');
    }
    return { startDate, endDate };
  }

  private parseDate(value: string, field: string): string {
    // reines Kalenderdatum als String validieren, nie in ein Date umwandeln (sonst Zeitzonen-Verschiebung)
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
    if (!match) {
      throw new BadRequestException(
        `${field} is required and must be in format YYYY-MM-DD`,
      );
    }
    const [, year, month, day] = match.map(Number);
    const check = new Date(year, month - 1, day);
    const isValid =
      check.getFullYear() === year &&
      check.getMonth() === month - 1 &&
      check.getDate() === day;
    if (!isValid) {
      throw new BadRequestException(`${field} is not a valid calendar date`);
    }
    return value;
  }
}
