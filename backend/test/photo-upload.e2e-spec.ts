import type { Server } from 'node:http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PhotoModule } from '../src/photo/photo.module.js';

describe('PhotoController (e2e)', () => {
  let app: INestApplication<Server>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PhotoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // TODO tests
  it.skip('/photo (GET)', () => {
    return request(app.getHttpServer())
      .get('/photo-upload')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
