import { Test, TestingModule } from '@nestjs/testing';
import { TutorialVideoService } from './tutorial-video.service';

describe('TutorialVideoService', () => {
  let service: TutorialVideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutorialVideoService],
    }).compile();

    service = module.get<TutorialVideoService>(TutorialVideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
