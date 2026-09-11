import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import request from 'supertest';
import { StreakModule } from '../src/streak/streak.module.js';
import { Photo } from '../src/photo/photo.entity.js';
import { Challenge } from '../src/challenge/challenge.entity.js';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard.js';
import { FakeAuthGuard } from './fake-auth.guard.js';

describe('StreakController /streak (e2e)', () => {
  let app: INestApplication<Server>;
  let photoRepository: Repository<Photo>;

  const userA = 'user-a';
  const userB = 'user-b';

  function asUser(userId: string): Record<string, string> {
    return { 'x-user-id': userId };
  }

  async function seedPhoto(userId: string, captureDate: string): Promise<void> {
    await photoRepository.save(
      photoRepository.create({
        id: randomUUID(),
        userId,
        filename: 'photo.webp',
        mimeType: 'image/webp',
        captureDate,
        description: '',
        challenge: null,
      }),
    );
  }

  beforeAll(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 10));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          dropSchema: true,
          entities: [Photo, Challenge],
          synchronize: true,
        }),
        StreakModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(FakeAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    photoRepository = moduleFixture.get(getRepositoryToken(Photo));

    await seedPhoto(userA, '2026-09-08');
    await seedPhoto(userA, '2026-09-09');
    await seedPhoto(userA, '2026-09-10');
    await seedPhoto(userB, '2026-09-10');
  });

  afterAll(async () => {
    vi.useRealTimers();
    await app?.close();
  });

  it('rejects requests without an authenticated user', () => {
    return request(app.getHttpServer()).get('/streak').expect(403);
  });

  it("returns the requesting user's streak and dates, most recent first", async () => {
    const res = await request(app.getHttpServer())
      .get('/streak')
      .set(asUser(userA))
      .expect(200);

    expect(res.body).toEqual({
      streak: 3,
      dates: ['2026-09-10', '2026-09-09', '2026-09-08'],
    });
  });

  it('returns 0 for a user without any photos', async () => {
    const res = await request(app.getHttpServer())
      .get('/streak')
      .set(asUser('user-without-photos'))
      .expect(200);

    expect(res.body).toEqual({ streak: 0, dates: [] });
  });
});
