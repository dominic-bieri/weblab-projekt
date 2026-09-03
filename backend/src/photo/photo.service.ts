import { createReadStream, type ReadStream } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { access, mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

/** Path of the file on disk for a given photo record. */
function storagePath(photo: Photo): string {
  return join(UPLOAD_DIR, photo.id + extname(photo.filename));
}

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async savePhoto(file: Express.Multer.File): Promise<Photo> {
    const id = randomUUID();
    const storedName = `${id}${extname(file.originalname)}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, storedName), file.buffer);

    try {
      return await this.photoRepository.save(
        this.photoRepository.create({
          id,
          filename: file.originalname,
          mimeType: file.mimetype,
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

  /** Metadata plus a read stream of the actual image file. */
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
}
