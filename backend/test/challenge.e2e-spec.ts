import type { Server } from 'node:http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { ChallengeModule } from '../src/challenge/challenge.module.js';
import { Challenge } from '../src/challenge/challenge.entity.js';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard.js';
import { FakeAuthGuard } from './fake-auth.guard.js';

describe('ChallengeController /challenge (e2e)', () => {
  let app: INestApplication<Server>;

  const userA = 'user-a';
  const userB = 'user-b';

  const validChallenge = {
    title: 'Sonnenuntergänge',
    description: 'Jeden Tag ein Foto bei Sonnenuntergang',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
  };

  function asUser(userId: string): Record<string, string> {
    return { 'x-user-id': userId };
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          dropSchema: true,
          entities: [Challenge],
          synchronize: true,
        }),
        ChallengeModule,
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
  });

  afterAll(async () => {
    await app?.close();
  });

  it('rejects requests without an authenticated user', () => {
    return request(app.getHttpServer()).get('/challenge').expect(403);
  });

  it('creates a challenge for the authenticated user', async () => {
    const res = await request(app.getHttpServer())
      .post('/challenge')
      .set(asUser(userA))
      .send(validChallenge)
      .expect(201);

    expect(res.body).toMatchObject(validChallenge);
    expect(res.body.id).toBeDefined();
  });

  it('rejects a challenge whose endDate is before startDate', () => {
    return request(app.getHttpServer())
      .post('/challenge')
      .set(asUser(userA))
      .send({
        ...validChallenge,
        startDate: '2026-02-10',
        endDate: '2026-02-01',
      })
      .expect(400);
  });

  it('rejects unknown fields (forbidNonWhitelisted)', () => {
    return request(app.getHttpServer())
      .post('/challenge')
      .set(asUser(userA))
      .send({ ...validChallenge, extra: 'nope' })
      .expect(400);
  });

  describe('ownership isolation between users', () => {
    let challengeOfUserA: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/challenge')
        .set(asUser(userA))
        .send(validChallenge)
        .expect(201);
      challengeOfUserA = res.body.id;

      await request(app.getHttpServer())
        .post('/challenge')
        .set(asUser(userB))
        .send({ ...validChallenge, title: 'User Bs Challenge' })
        .expect(201);
    });

    it("only returns the requesting user's own challenges", async () => {
      const res = await request(app.getHttpServer())
        .get('/challenge')
        .set(asUser(userA))
        .expect(200);

      expect(
        res.body.every(
          (challenge: { id: string }) => challenge.id !== undefined,
        ),
      ).toBe(true);
      expect(
        res.body.some(
          (challenge: { title: string }) =>
            challenge.title === 'User Bs Challenge',
        ),
      ).toBe(false);
    });

    it("returns 404 when a user tries to update another user's challenge", () => {
      return request(app.getHttpServer())
        .put(`/challenge/${challengeOfUserA}`)
        .set(asUser(userB))
        .send({ ...validChallenge, title: 'Hijacked' })
        .expect(404);
    });

    it("returns 404 when a user tries to delete another user's challenge", () => {
      return request(app.getHttpServer())
        .delete(`/challenge/${challengeOfUserA}`)
        .set(asUser(userB))
        .expect(404);
    });

    it('leaves the challenge untouched after a failed cross-user update/delete', async () => {
      const res = await request(app.getHttpServer())
        .get('/challenge')
        .set(asUser(userA))
        .expect(200);

      const stillThere = res.body.find(
        (challenge: { id: string }) => challenge.id === challengeOfUserA,
      );
      expect(stillThere).toMatchObject(validChallenge);
    });
  });

  describe('update and delete on an owned challenge', () => {
    let challengeId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/challenge')
        .set(asUser(userA))
        .send(validChallenge)
        .expect(201);
      challengeId = res.body.id;
    });

    it('updates the challenge and returns the new values', async () => {
      const updated = { ...validChallenge, title: 'Neuer Titel' };
      const res = await request(app.getHttpServer())
        .put(`/challenge/${challengeId}`)
        .set(asUser(userA))
        .send(updated)
        .expect(200);

      expect(res.body).toMatchObject(updated);
    });

    it('returns 404 when updating a non-existent challenge', () => {
      return request(app.getHttpServer())
        .put('/challenge/11111111-1111-1111-1111-111111111111')
        .set(asUser(userA))
        .send(validChallenge)
        .expect(404);
    });

    it('deletes the challenge', async () => {
      await request(app.getHttpServer())
        .delete(`/challenge/${challengeId}`)
        .set(asUser(userA))
        .expect(200);

      const res = await request(app.getHttpServer())
        .get('/challenge')
        .set(asUser(userA))
        .expect(200);
      expect(
        res.body.some(
          (challenge: { id: string }) => challenge.id === challengeId,
        ),
      ).toBe(false);
    });
  });
});
