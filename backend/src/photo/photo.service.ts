import { createReadStream, type ReadStream } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { access, mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity.js';
import { PhotoDto } from './photo.dto.js';
import { ChallengeService } from '../challenge/challenge.service.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly challengeService: ChallengeService,
  ) {}

  async savePhoto(
    file: Express.Multer.File,
    userId: string,
    meta: PhotoDto,
  ): Promise<Photo> {
    const id = randomUUID();
    const storedName = `${id}${extname(file.originalname)}`;
    const challengeId = await this.resolveChallengeId(meta.challengeId, userId);

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, storedName), file.buffer);

    try {
      return await this.photoRepository.save(
        this.photoRepository.create({
          id,
          userId,
          filename: file.originalname,
          mimeType: file.mimetype,
          captureDate: meta.captureDate,
          description: meta.description,
          challengeId,
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
      captureDate: dto.captureDate,
      description: dto.description,
      challengeId: await this.resolveChallengeId(dto.challengeId, userId),
    };

    const photo = await this.photoRepository.preload({ id, ...changes });
    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`);
    }
    return this.photoRepository.save(photo);
  }

  async deletePhoto(id: string, userId: string): Promise<void> {
    const photo = await this.photoRepository.findOneBy({ id, userId });
    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`);
    }

    await this.photoRepository.delete(id);
    // Datei best-effort entfernen; ein verwaister Rest ist harmloser als ein 500 beim Löschen.
    await unlink(this.storagePath(photo)).catch(() => {});
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

  private async resolveChallengeId(
    value: string | null | undefined,
    userId: string,
  ): Promise<string | null> {
    if (!value) {
      return null;
    }
    // wirft NotFoundException, falls die Challenge nicht existiert oder einem anderen User gehört
    await this.challengeService.findOne(value, userId);
    return value;
  }
}
