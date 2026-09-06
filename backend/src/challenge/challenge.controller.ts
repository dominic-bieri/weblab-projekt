import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service.js';
import { ChallengeDto } from './challenge.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtUser } from '../auth/jwt.strategy.js';

@Controller('challenge')
@UseGuards(JwtAuthGuard)
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  createChallenge(@Body() dto: ChallengeDto, @CurrentUser() user: JwtUser) {
    return this.challengeService.createChallenge(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.challengeService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.challengeService.findOne(id, user.userId);
  }

  @Put(':id')
  updateChallenge(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChallengeDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.challengeService.updateChallenge(id, user.userId, dto);
  }

  @Delete(':id')
  deleteChallenge(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.challengeService.deleteChallenge(id, user.userId);
  }
}
