import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoService } from './photo.service.js';
import { PhotoDto } from './photo.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: PhotoDto,
  ) {
    return this.photoService.savePhoto(file, dto);
  }

  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  async getPhoto(@Param('id', ParseUUIDPipe) id: string) {
    const { photo, stream } = await this.photoService.getFile(id);
    return new StreamableFile(stream, {
      type: photo.mimeType,
      disposition: `inline; filename="${encodeURIComponent(photo.filename)}"`,
    });
  }

  @Patch(':id')
  updatePhoto(@Param('id', ParseUUIDPipe) id: string, @Body() dto: PhotoDto) {
    return this.photoService.updatePhoto(id, dto);
  }

  @Delete(':id')
  deletePhoto(@Param('id', ParseUUIDPipe) id: string) {
    return this.photoService.deletePhoto(id);
  }
}
