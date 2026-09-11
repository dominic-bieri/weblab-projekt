import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import request from 'supertest';
import { PhotoModule } from '../src/photo/photo.module.js';
import { ChallengeModule } from '../src/challenge/challenge.module.js';
import { Photo } from '../src/photo/photo.entity.js';
import { Challenge } from '../src/challenge/challenge.entity.js';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard.js';
import { FakeAuthGuard } from './fake-auth.guard.js';

describe('PhotoController /photo CRUD (e2e)', () => {
  let app: INestApplication<Server>;
  let photoRepository: Repository<Photo>;
  let challengeRepository: Repository<Challenge>;

  const userA = 'user-a';
  const userB = 'user-b';

  function asUser(userId: string): Record<string, string> {
    return { 'x-user-id': userId };
  }

  async function seedPhoto(overrides: Partial<Photo> = {}): Promise<Photo> {
    return photoRepository.save(
      photoRepository.create({
        id: randomUUID(),
        userId: userA,
        filename: 'sunset.webp',
        mimeType: 'image/webp',
        captureDate: '2026-01-05',
        description: 'Sonnenuntergang',
        challenge: null,
        ...overrides,
      }),
    );
  }

  async function seedChallenge(userId: string): Promise<Challenge> {
    return challengeRepository.save(
      challengeRepository.create({
        id: randomUUID(),
        userId,
        title: 'Challenge',
        description: 'Beschreibung',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      }),
    );
  }

  beforeAll(async () => {
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
  });

  describe('GET /photo', () => {
    it("only returns the requesting user's photos, each with a signed photoUrl", async () => {
      const own = await seedPhoto({ userId: userA });
      await seedPhoto({ userId: userB, filename: 'other.webp' });

      const res = await request(app.getHttpServer())
        .get('/photo')
        .set(asUser(userA))
        .expect(200);

      const ids = res.body.map((photo: { id: string }) => photo.id);
      expect(ids).toContain(own.id);
      expect(
        res.body.every((photo: { userId: string }) => photo.userId === userA),
      ).toBe(true);
      const returned = res.body.find(
        (photo: { id: string }) => photo.id === own.id,
      );
      expect(returned.photoUrl).toMatch(
        new RegExp(`^/photo/${own.id}\\?exp=\\d+&sig=`),
      );
    });
  });

  describe('PUT /photo/:id', () => {
    it('updates description, captureDate and challengeId for an owned photo', async () => {
      const photo = await seedPhoto();
      const challenge = await seedChallenge(userA);

      const res = await request(app.getHttpServer())
        .put(`/photo/${photo.id}`)
        .set(asUser(userA))
        .send({
          captureDate: '2026-01-06',
          description: 'Neue Beschreibung',
          challengeId: challenge.id,
        })
        .expect(200);

      expect(res.body).toMatchObject({
        captureDate: '2026-01-06',
        description: 'Neue Beschreibung',
        challengeId: challenge.id,
      });
    });

    it('clears the challenge link when challengeId is omitted', async () => {
      const challenge = await seedChallenge(userA);
      const photo = await seedPhoto({ challenge });

      const res = await request(app.getHttpServer())
        .put(`/photo/${photo.id}`)
        .set(asUser(userA))
        .send({ captureDate: '2026-01-06', description: 'ohne Challenge' })
        .expect(200);

      expect(res.body.challengeId).toBeNull();
    });

    it("returns 404 when updating another user's photo", async () => {
      const photo = await seedPhoto({ userId: userB });

      await request(app.getHttpServer())
        .put(`/photo/${photo.id}`)
        .set(asUser(userA))
        .send({ captureDate: '2026-01-06', description: 'Hijacked' })
        .expect(404);
    });

    it("returns 404 when linking to another user's challenge", async () => {
      const photo = await seedPhoto();
      const foreignChallenge = await seedChallenge(userB);

      await request(app.getHttpServer())
        .put(`/photo/${photo.id}`)
        .set(asUser(userA))
        .send({
          captureDate: '2026-01-06',
          description: 'x',
          challengeId: foreignChallenge.id,
        })
        .expect(404);
    });

    it('returns 404 when linking to a non-existent challenge', async () => {
      const photo = await seedPhoto();

      await request(app.getHttpServer())
        .put(`/photo/${photo.id}`)
        .set(asUser(userA))
        .send({
          captureDate: '2026-01-06',
          description: 'x',
          challengeId: randomUUID(),
        })
        .expect(404);
    });
  });

  describe('DELETE /photo/:id', () => {
    it('deletes an owned photo', async () => {
      const photo = await seedPhoto();

      await request(app.getHttpServer())
        .delete(`/photo/${photo.id}`)
        .set(asUser(userA))
        .expect(200);

      await expect(
        photoRepository.findOneBy({ id: photo.id }),
      ).resolves.toBeNull();
    });

    it("returns 404 and keeps the photo when deleting another user's photo", async () => {
      const photo = await seedPhoto({ userId: userB });

      await request(app.getHttpServer())
        .delete(`/photo/${photo.id}`)
        .set(asUser(userA))
        .expect(404);

      await expect(
        photoRepository.findOneBy({ id: photo.id }),
      ).resolves.not.toBeNull();
    });

    it('returns 404 when deleting a non-existent photo', () => {
      return request(app.getHttpServer())
        .delete('/photo/11111111-1111-1111-1111-111111111111')
        .set(asUser(userA))
        .expect(404);
    });
  });
});
