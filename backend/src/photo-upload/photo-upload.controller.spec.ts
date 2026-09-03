import { Test, TestingModule } from '@nestjs/testing';
import { PhotoUploadController } from './photo-upload.controller.js';
import { PhotoUploadService } from './photo-upload.service.js';

describe('PhotoUploadController', () => {
  let controller: PhotoUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotoUploadController],
      providers: [PhotoUploadService],
    }).compile();

    controller = module.get<PhotoUploadController>(PhotoUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
