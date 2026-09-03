import { Module } from '@nestjs/common';
import { PhotoUploadService } from './photo-upload.service.js';
import { PhotoUploadController } from './photo-upload.controller.js';

@Module({
  controllers: [PhotoUploadController],
  providers: [PhotoUploadService],
})
export class PhotoUploadModule {}
