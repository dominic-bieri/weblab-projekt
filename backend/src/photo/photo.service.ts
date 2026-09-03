import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

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
}
