import { createReadStream, type ReadStream } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { access, mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity.js';
import { PhotoDto } from './photo.dto.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

function storagePath(photo: Photo): string {
  return join(UPLOAD_DIR, photo.id + extname(photo.filename));
}

function parseCaptureDate(value?: string): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('captureDate is not a valid date');
  }
  return date;
}

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async savePhoto(
    file: Express.Multer.File,
    userId: string,
    meta: PhotoDto = {},
  ): Promise<Photo> {
    const id = randomUUID();
    const storedName = `${id}${extname(file.originalname)}`;
    const captureDate = parseCaptureDate(meta.captureDate);

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, storedName), file.buffer);

    try {
      return await this.photoRepository.save(
        this.photoRepository.create({
          id,
          userId,
          filename: file.originalname,
          mimeType: file.mimetype,
          captureDate,
          description: meta.description?.trim() || null,
        }),
      );
    } catch (err) {
      // DB-Insert fehlgeschlagen – Datei wieder entfernen, damit Disk und DB nicht auseinanderlaufen
      await unlink(join(UPLOAD_DIR, storedName)).catch(() => {});
      throw err;
    }
  }

  findAll(userId: string): Promise<Photo[]> {
    return this.photoRepository.find({
      where: { userId },
      order: { captureDate: 'DESC' },
    });
  }

  async getFile(id: string): Promise<{ photo: Photo; stream: ReadStream }> {
    const photo = await this.photoRepository.findOneBy({ id });
    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`);
    }
    const path = storagePath(photo);

    try {
      await access(path);
    } catch {
      throw new NotFoundException(`File for photo ${id} is missing on disk`);
    }

    return { photo, stream: createReadStream(path) };
  }

  async updatePhoto(id: string, dto: PhotoDto, userId: string): Promise<Photo> {
    await this.assertOwnership(id, userId);

    const changes: Partial<Photo> = {};
    if (dto.captureDate !== undefined) {
      changes.captureDate = parseCaptureDate(dto.captureDate);
    }
    if (dto.description !== undefined) {
      changes.description = dto.description.trim() || null;
    }

    const photo = await this.photoRepository.preload({ id, ...changes });
    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`);
    }
    return this.photoRepository.save(photo);
  }

  async deletePhoto(id: string, userId: string) {
    await this.assertOwnership(id, userId);
    await this.photoRepository.delete(id);
  }

  private async assertOwnership(id: string, userId: string): Promise<void> {
    const owned = await this.photoRepository.existsBy({ id, userId });
    if (!owned) {
      throw new NotFoundException(`Photo ${id} not found`);
    }
  }
}
