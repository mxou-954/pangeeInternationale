import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { Guide } from './entities/guide.entity';
import { GuideModule } from './entities/guide.entity';

@Injectable()
export class GuideService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,

    @InjectRepository(Guide)
    private guideRepo: Repository<Guide>,
  ) {}

  async create(createGuideDto: CreateGuideDto, farmerId: string) {
    const farmer = await this.farmerRepo.findOne({ where: { id: farmerId } });
    if (!farmer)
      throw new BadRequestException('Impossible de trouver le farmer');

    // upsert par (farmer, module)
    let guide = await this.guideRepo.findOne({
      where: { farmer: { id: farmer.id }, module: createGuideDto.module },
      relations: ['farmer'],
    });

    if (!guide) {
      guide = this.guideRepo.create({
        farmer,
        module: createGuideDto.module,
        finish: createGuideDto.finish ?? false,
      });
    } else {
      guide.finish = createGuideDto.finish ?? guide.finish;
    }

    const saved = await this.guideRepo.save(guide);
    return { module: saved.module, finish: saved.finish };
  }

  async findAll(farmerId) {
    const farmer = await this.farmerRepo.findOne({
      where: { id: farmerId },
      relations: ['guides'],
    });

    if (!farmer) {
      throw new BadRequestException('Impossible de trouver le farmer');
    }

    // dictionnaire module -> finish
    const finishByModule = new Map(
      (farmer.guides ?? []).map((g) => [g.module, g.finish]),
    );

    // modules "canonique"
    const ALL_MODULES: GuideModule[] = [
      GuideModule.Fields,
      GuideModule.Stocks,
      GuideModule.Activities,
      GuideModule.Equipements,
      GuideModule.Ask,
    ];

    // construire la réponse finale
    return ALL_MODULES.map((m) => ({
      module: m,
      finish: finishByModule.get(m) ?? false,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} guide`;
  }

  async update(farmerId: string, module: GuideModule, dto: UpdateGuideDto) {
    const farmer = await this.farmerRepo.findOne({ where: { id: farmerId } });
    if (!farmer) throw new BadRequestException('Impossible de trouver le farmer');

    const guide = await this.guideRepo.findOne({
      where: { farmer: { id: farmer.id }, module },
      relations: ['farmer'],
    });

    if (!guide) {
      // si tu préfères 404, remplace par NotFoundException
      // ou créer automatiquement :
      const created = this.guideRepo.create({ farmer, module, finish: dto.finish });
      const saved = await this.guideRepo.save(created);
      return { module: saved.module, finish: saved.finish };
    }

    guide.finish = dto.finish;
    const saved = await this.guideRepo.save(guide);
    return { module: saved.module, finish: saved.finish };
  }

  remove(id: number) {
    return `This action removes a #${id} guide`;
  }
}
