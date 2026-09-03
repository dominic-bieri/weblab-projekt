import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Injectable } from '@nestjs/common';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class PhotoUploadService {
  async savePhoto(file: Express.Multer.File): Promise<{ filename: string }> {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const filename = `${randomUUID()}${extname(file.originalname)}`;
    await writeFile(join(UPLOAD_DIR, filename), file.buffer);

    return { filename };
  }
}
