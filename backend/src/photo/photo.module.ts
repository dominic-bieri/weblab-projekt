import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service.js';
import { PhotoController } from './photo.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './photo.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { ChallengeModule } from '../challenge/challenge.module.js';
import { PhotoUrlSigner } from './photo-url.signer.js';
import { SignedPhotoUrlGuard } from './signed-photo-url.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), AuthModule, ChallengeModule],
  controllers: [PhotoController],
  providers: [PhotoService, PhotoUrlSigner, SignedPhotoUrlGuard],
})
export class PhotoModule {}
