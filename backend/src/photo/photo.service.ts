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

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async savePhoto(
    file: Express.Multer.File,
    userId: string,
    meta: PhotoDto,
  ): Promise<Photo> {
    const id = randomUUID();
    const storedName = `${id}${extname(file.originalname)}`;
    const captureDate = this.parseCaptureDate(meta.captureDate);

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
          description: this.parseDescription(meta.description),
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
    const path = this.storagePath(photo);

    try {
      await access(path);
    } catch {
      throw new NotFoundException(`File for photo ${id} is missing on disk`);
    }

    return { photo, stream: createReadStream(path) };
  }

  async updatePhoto(id: string, dto: PhotoDto, userId: string): Promise<Photo> {
    await this.assertOwnership(id, userId);

    const changes: Partial<Photo> = {
      captureDate: this.parseCaptureDate(dto.captureDate),
      description: this.parseDescription(dto.description),
    };

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

  private storagePath(photo: Photo): string {
    return join(UPLOAD_DIR, photo.id + extname(photo.filename));
  }

  private parseCaptureDate(value: string): string {
    // nur als String validieren, nie in ein Date umwandeln (sonst Zeitzonen-Verschiebung)
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
    if (!match) {
      throw new BadRequestException(
        'captureDate is required and must be in format YYYY-MM-DD',
      );
    }
    const [, year, month, day] = match.map(Number);
    const check = new Date(year, month - 1, day);
    const isValid =
      check.getFullYear() === year &&
      check.getMonth() === month - 1 &&
      check.getDate() === day;
    if (!isValid) {
      throw new BadRequestException('captureDate is not a valid calendar date');
    }
    return value;
  }

  private parseDescription(value: string): string {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new BadRequestException('description is required');
    }
    return trimmed;
  }
}
