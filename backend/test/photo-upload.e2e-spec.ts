import type { Server } from 'node:http';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PhotoUploadModule } from './../src/photo-upload/photo-upload.module.js';

describe('PhotoUploadController (e2e)', () => {
  let app: INestApplication<Server>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PhotoUploadModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/photo-upload (GET)', () => {
    return request(app.getHttpServer())
      .get('/photo-upload')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
