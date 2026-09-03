import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoUploadService } from './photo-upload.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('photo-upload')
export class PhotoUploadController {
  constructor(private readonly photoUploadService: PhotoUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.photoUploadService.savePhoto(file);
  }
}
