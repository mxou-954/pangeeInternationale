import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TutorialVideoService } from './tutorial-video.service';
import { CreateTutorialVideoDto } from './dto/create-tutorial-video.dto';
import { UpdateTutorialVideoDto } from './dto/update-tutorial-video.dto';

@Controller('tutorial-video')
export class TutorialVideoController {
  constructor(private readonly tutorialVideoService: TutorialVideoService) {}

  @Post()
  create(@Body() createTutorialVideoDto: CreateTutorialVideoDto) {
    return this.tutorialVideoService.create(createTutorialVideoDto);
  }

  @Get()
  findAll() {
    return this.tutorialVideoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorialVideoService.findOne(+id);
  }

  @Patch(':videoId')
  update(@Param('videoId') videoId: string, @Body() updateTutorialVideoDto: UpdateTutorialVideoDto) {
    return this.tutorialVideoService.update(videoId, updateTutorialVideoDto);
  }

  @Delete(':videoId')
  remove(@Param('videoId') videoId: string) {
    return this.tutorialVideoService.remove(videoId);
  }
}
