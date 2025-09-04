import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTutorialVideoDto } from './dto/create-tutorial-video.dto';
import { UpdateTutorialVideoDto } from './dto/update-tutorial-video.dto';
import { TutorialVideo } from './entities/tutorial-video.entity';

@Injectable()
export class TutorialVideoService {
  constructor(
    @InjectRepository(TutorialVideo)
    private videoRepo: Repository<TutorialVideo>,
  ) {}

  async create(createTutorialVideoDto: CreateTutorialVideoDto) {
    const video = await this.videoRepo.create(createTutorialVideoDto);

    return this.videoRepo.save(video);
  }

  findAll() {
    return this.videoRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} tutorialVideo`;
  }

  async update(videoId, updateTutorialVideoDto: UpdateTutorialVideoDto) {
    const video = await this.videoRepo.findOne({ where: { id: videoId } });
    if (!video) throw new BadGatewayException('video introuvable');

    Object.assign(video, updateTutorialVideoDto);
    return this.videoRepo.save(video);
  }

  async remove(videoId) {
    const video = await this.videoRepo.findOne({
      where: { id: videoId },
    });

    if (!video) {
      throw new BadRequestException('Impossible de retrouver la video');
    }

    await this.videoRepo.remove(video);
    return { videoId };
  }
}
