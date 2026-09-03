import { Test, TestingModule } from '@nestjs/testing';
import { PhotoUploadService } from './photo-upload.service.js';

describe('PhotoUploadService', () => {
  let service: PhotoUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotoUploadService],
    }).compile();

    service = module.get<PhotoUploadService>(PhotoUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
