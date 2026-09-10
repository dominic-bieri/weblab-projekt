import type { Server } from 'node:http';
import { Readable } from 'node:stream';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PhotoController } from '../src/photo/photo.controller.js';
import { PhotoService } from '../src/photo/photo.service.js';
import { PhotoUrlSigner } from '../src/photo/photo-url.signer.js';
import { SignedPhotoUrlGuard } from '../src/photo/signed-photo-url.guard.js';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard.js';

const PHOTO_ID = '11111111-1111-1111-1111-111111111111';
const IMAGE_BYTES = 'fake-webp-bytes';

describe('PhotoController /photo/:id (e2e)', () => {
  let app: INestApplication<Server>;

  const photoServiceMock = {
    getFile: async () => ({
      photo: { mimeType: 'image/webp', filename: 'photo.webp' },
      stream: Readable.from(Buffer.from(IMAGE_BYTES)),
    }),
  };

  beforeAll(async () => {
    process.env.PHOTO_URL_SIGNING_SECRET = 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PhotoController],
      providers: [
        PhotoUrlSigner,
        SignedPhotoUrlGuard,
        { provide: PhotoService, useValue: photoServiceMock },
      ],
    })
      // Jwt interessiert in diesem Test nicht
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  function signedUrl(): string {
    const { exp, sig } = app.get(PhotoUrlSigner).sign(PHOTO_ID);
    return `/photo/${PHOTO_ID}?exp=${exp}&sig=${sig}`;
  }

  it('rejects a request without a signature', () => {
    return request(app.getHttpServer()).get(`/photo/${PHOTO_ID}`).expect(401);
  });

  it('rejects a request with an invalid signature', () => {
    return request(app.getHttpServer())
      .get(
        `/photo/${PHOTO_ID}?exp=${Math.floor(Date.now() / 1000) + 900}&sig=deadbeef`,
      )
      .expect(401);
  });

  it('streams the photo for a valid signed URL and marks it cacheable', async () => {
    const res = await request(app.getHttpServer()).get(signedUrl()).expect(200);

    expect(res.headers['cache-control']).toBe(
      'private, max-age=900, immutable',
    );
    expect(res.headers['content-type']).toContain('image/webp');
    expect(Buffer.from(res.body).toString()).toBe(IMAGE_BYTES);
  });
});
