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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoService } from './photo.service.js';
import { PhotoDto } from './photo.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtUser } from '../auth/jwt.strategy.js';
import { PhotoUrlSigner } from './photo-url.signer.js';
import { SignedPhotoUrlGuard } from './signed-photo-url.guard.js';

@Controller('photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly photoUrlSigner: PhotoUrlSigner,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: PhotoDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.photoService.savePhoto(file, user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: JwtUser) {
    const photos = await this.photoService.findAll(user.userId);
    return photos.map((photo) => {
      const { exp, sig } = this.photoUrlSigner.sign(photo.id);
      return { ...photo, imageUrl: `/photo/${photo.id}?exp=${exp}&sig=${sig}` };
    });
  }

  // ADR 3 - Signierte URLs für den Bild-Stream-Endpunkt
  @Get(':id')
  @UseGuards(SignedPhotoUrlGuard)
  async getPhoto(@Param('id', ParseUUIDPipe) id: string) {
    const { photo, stream } = await this.photoService.getFile(id);
    return new StreamableFile(stream, {
      type: photo.mimeType,
      disposition: `inline; filename="${encodeURIComponent(photo.filename)}"`,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updatePhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PhotoDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.photoService.updatePhoto(id, dto, user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deletePhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.photoService.deletePhoto(id, user.userId);
  }
}
