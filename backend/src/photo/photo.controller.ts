import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Header,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
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

const MAX_PHOTO_BYTES = 200 * 1024 * 1024;

@Controller('photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly photoUrlSigner: PhotoUrlSigner,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_PHOTO_BYTES },
    }),
  )
  uploadPhoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_PHOTO_BYTES }),
          new FileTypeValidator({
            // prüft die Magic Numbers, nicht nur den Client-Content-Type
            fileType: /^image\/(jpeg|png|webp)$/,
            overrideMimeType: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
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
      return { ...photo, photoUrl: `/photo/${photo.id}?exp=${exp}&sig=${sig}` };
    });
  }

  // ADR 1 - Signierte URLs für den Bild-Stream-Endpunkt.
  // Bildinhalt pro id ist unveränderlich; die signierte URL ist ~15 min stabil
  // daher darf der Browser sie zwischenspeichern.
  @Get(':id')
  @UseGuards(SignedPhotoUrlGuard)
  @Header('Cache-Control', 'private, max-age=900, immutable')
  async getPhoto(@Param('id', ParseUUIDPipe) id: string) {
    const { photo, stream } = await this.photoService.getFile(id);
    return new StreamableFile(stream, {
      type: photo.mimeType,
      disposition: `inline; filename="${encodeURIComponent(photo.filename)}"`,
    });
  }

  @Put(':id')
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
