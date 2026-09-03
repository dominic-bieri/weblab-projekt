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
          filename: file.originalname,
          mimeType: file.mimetype,
          captureDate,
          description: meta.description?.trim() || null,
        }),
      );
    } catch (err) {
      // DB insert failed – remove the file so disk and DB don't drift apart
      await unlink(join(UPLOAD_DIR, storedName)).catch(() => {});
      throw err;
    }
  }

  findAll(): Promise<Photo[]> {
    return this.photoRepository.find({ order: { captureDate: 'DESC' } });
  }

  async findOne(id: string): Promise<Photo> {
    const photo = await this.photoRepository.findOneBy({ id });
    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`);
    }
    return photo;
  }

  async getFile(id: string): Promise<{ photo: Photo; stream: ReadStream }> {
    const photo = await this.findOne(id);
    const path = storagePath(photo);

    try {
      await access(path);
    } catch {
      throw new NotFoundException(`File for photo ${id} is missing on disk`);
    }

    return { photo, stream: createReadStream(path) };
  }

  async updatePhoto(id: string, dto: PhotoDto): Promise<Photo> {
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

  deletePhoto(id: string) {
    this.photoRepository.delete(id);
  }
}
