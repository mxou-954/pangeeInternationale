import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialVideoService } from './tutorial-video.service';
import { TutorialVideoController } from './tutorial-video.controller';
import { TutorialVideo } from './entities/tutorial-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TutorialVideo])],
  controllers: [TutorialVideoController],
  providers: [TutorialVideoService],
})
export class TutorialVideoModule {}
