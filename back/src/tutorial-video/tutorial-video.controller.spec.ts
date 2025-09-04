import { Test, TestingModule } from '@nestjs/testing';
import { TutorialVideoController } from './tutorial-video.controller';
import { TutorialVideoService } from './tutorial-video.service';

describe('TutorialVideoController', () => {
  let controller: TutorialVideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorialVideoController],
      providers: [TutorialVideoService],
    }).compile();

    controller = module.get<TutorialVideoController>(TutorialVideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
