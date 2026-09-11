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
import { assertOwnership } from '../common/assert-ownership.js';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  createChallenge(userId: string, dto: ChallengeDto): Promise<Challenge> {
    this.assertDateOrder(dto);
    return this.challengeRepository.save(
      this.challengeRepository.create({ id: randomUUID(), userId, ...dto }),
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
    await assertOwnership(this.challengeRepository, 'Challenge', id, userId);
    this.assertDateOrder(dto);

    const challenge = await this.challengeRepository.preload({ id, ...dto });
    if (!challenge) {
      throw new NotFoundException(`Challenge ${id} not found`);
    }
    return this.challengeRepository.save(challenge);
  }

  async deleteChallenge(id: string, userId: string): Promise<void> {
    await assertOwnership(this.challengeRepository, 'Challenge', id, userId);
    await this.challengeRepository.delete(id);
  }

  // Feldübergreifend, daher nicht im DTO: "YYYY-MM-DD" ist chronologisch vergleichbar.
  private assertDateOrder(dto: ChallengeDto): void {
    if (dto.endDate < dto.startDate) {
      throw new BadRequestException('endDate must not be before startDate');
    }
  }
}
