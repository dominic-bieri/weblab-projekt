import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import request from 'supertest';
import sharp from 'sharp';
import { PhotoModule } from '../src/photo/photo.module.js';
import { ChallengeModule } from '../src/challenge/challenge.module.js';
import { Photo } from '../src/photo/photo.entity.js';
import { Challenge } from '../src/challenge/challenge.entity.js';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard.js';
import { FakeAuthGuard } from './fake-auth.guard.js';

describe('PhotoController POST /photo/upload (e2e)', () => {
  let app: INestApplication<Server>;
  let photoRepository: Repository<Photo>;
  let challengeRepository: Repository<Challenge>;
  let uploadDir: string;

  const userA = 'user-a';
  const userB = 'user-b';

  function asUser(userId: string): Record<string, string> {
    return { 'x-user-id': userId };
  }

  async function samplePng(): Promise<Buffer> {
    return sharp({
      create: {
        width: 4000,
        height: 3000,
        channels: 3,
        background: { r: 200, g: 80, b: 40 },
      },
    })
      .png()
      .toBuffer();
  }

  beforeAll(async () => {
    uploadDir = await mkdtemp(join(tmpdir(), 'daily-lens-upload-test-'));
    process.env.UPLOAD_DIR = uploadDir;
    process.env.PHOTO_URL_SIGNING_SECRET = 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          dropSchema: true,
          entities: [Photo, Challenge],
          synchronize: true,
        }),
        ChallengeModule,
        PhotoModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(FakeAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    photoRepository = moduleFixture.get(getRepositoryToken(Photo));
    challengeRepository = moduleFixture.get(getRepositoryToken(Challenge));
  });

  afterAll(async () => {
    await app?.close();
    delete process.env.UPLOAD_DIR;
    await rm(uploadDir, { recursive: true, force: true });
  });

  it('rejects an upload without an authenticated user', async () => {
    const png = await samplePng();

    await request(app.getHttpServer())
      .post('/photo/upload')
      .attach('file', png, 'sunset.png')
      .field('captureDate', '2026-01-05')
      .field('description', 'Sonnenuntergang')
      .expect(403);
  });

  it('rejects a file that is not an image', async () => {
    await request(app.getHttpServer())
      .post('/photo/upload')
      .set(asUser(userA))
      .attach('file', Buffer.from('just some text'), 'notes.txt')
      .field('captureDate', '2026-01-05')
      .field('description', 'kein Bild')
      .expect(400);
  });

  it('resizes, converts to webp, stores the file and persists the photo', async () => {
    const png = await samplePng();

    const res = await request(app.getHttpServer())
      .post('/photo/upload')
      .set(asUser(userA))
      .attach('file', png, 'sunset.png')
      .field('captureDate', '2026-01-05')
      .field('description', 'Sonnenuntergang')
      .expect(201);

    expect(res.body).toMatchObject({
      mimeType: 'image/webp',
      captureDate: '2026-01-05',
      description: 'Sonnenuntergang',
      userId: userA,
    });
    expect(res.body.filename).toBe('sunset.webp');

    const stored = await photoRepository.findOneBy({ id: res.body.id });
    expect(stored).not.toBeNull();

    const storedPath = join(uploadDir, `${res.body.id}.webp`);
    await expect(access(storedPath)).resolves.toBeUndefined();

    const bytes = await readFile(storedPath);
    const metadata = await sharp(bytes).metadata();
    expect(metadata.format).toBe('webp');
    // Original war 4000x3000 -> muss auf MAX_IMAGE_DIMENSION (2048) begrenzt werden.
    expect(metadata.width).toBeLessThanOrEqual(2048);
    expect(metadata.height).toBeLessThanOrEqual(2048);
  });

  it('links the uploaded photo to an owned challenge', async () => {
    const challenge = await challengeRepository.save(
      challengeRepository.create({
        id: randomUUID(),
        userId: userA,
        title: 'Challenge',
        description: 'Beschreibung',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      }),
    );
    const png = await samplePng();

    const res = await request(app.getHttpServer())
      .post('/photo/upload')
      .set(asUser(userA))
      .attach('file', png, 'sunset.png')
      .field('captureDate', '2026-01-05')
      .field('description', 'mit Challenge')
      .field('challengeId', challenge.id)
      .expect(201);

    expect(res.body.challengeId).toBe(challenge.id);
  });

  it("rejects an upload linked to another user's challenge", async () => {
    const foreignChallenge = await challengeRepository.save(
      challengeRepository.create({
        id: randomUUID(),
        userId: userB,
        title: 'Fremde Challenge',
        description: 'Beschreibung',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      }),
    );
    const png = await samplePng();

    await request(app.getHttpServer())
      .post('/photo/upload')
      .set(asUser(userA))
      .attach('file', png, 'sunset.png')
      .field('captureDate', '2026-01-05')
      .field('description', 'x')
      .field('challengeId', foreignChallenge.id)
      .expect(404);
  });

  it('removes the stored file from disk on delete', async () => {
    const png = await samplePng();

    const uploaded = await request(app.getHttpServer())
      .post('/photo/upload')
      .set(asUser(userA))
      .attach('file', png, 'sunset.png')
      .field('captureDate', '2026-01-05')
      .field('description', 'wird gelöscht')
      .expect(201);

    const storedPath = join(uploadDir, `${uploaded.body.id}.webp`);
    await expect(access(storedPath)).resolves.toBeUndefined();

    await request(app.getHttpServer())
      .delete(`/photo/${uploaded.body.id}`)
      .set(asUser(userA))
      .expect(200);

    await expect(access(storedPath)).rejects.toThrow();
  });
});
