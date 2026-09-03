import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoService } from './photo.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.photoService.savePhoto(file);
  }

  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  async getFile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const { photo, stream } = await this.photoService.getFile(id);
    return new StreamableFile(stream, {
      type: photo.mimeType,
      disposition: `inline; filename="${encodeURIComponent(photo.filename)}"`,
    });
  }
}
