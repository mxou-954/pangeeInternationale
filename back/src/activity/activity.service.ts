import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,

    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,
  ) {}

  async create(createActivityDto: CreateActivityDto, farmerId: string) {
    const farmer = await this.farmerRepo.findOne({ where: { id: farmerId } });
    if (!farmer) {
      throw new UnauthorizedException('Impossible de trouver le farmer');
    }

    const author = 'Courbeyrette Maxime';
    let description = '';

    switch (createActivityDto.type) {
      case 'comment':
        description = 'Nouveau commentaire ajouté';
        break;
      case 'commentDelete':
        description = 'Un commentaire a été supprimé';
        break;
      case 'visit':
        description = 'Nouvelle visite prévue';
        break;
      case 'profile_update':
        description = 'Nouveau changement dans le profil';
        break;
      case 'document':
        description = 'Nouveau document ajouté';
        break;
      default:
        description = 'Nouveau message reçu';
        break;
    }

    const activity = this.activityRepo.create({
      ...createActivityDto,
      farmer,
      author,
      description,
    });

    return await this.activityRepo.save(activity);
  }

  async findAll(farmerId: string) {
    const activity = await this.activityRepo.find({
      where: {
        farmer: {
          id: farmerId,
        },
      },
      order: {
        timestamp: 'DESC',
      },
    });

    return activity;
  }

  findOne(id: string) {
    return `This action returns a #${id} activity`;
  }

  update(id: string, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: string) {
    return `This action removes a #${id} activity`;
  }
}
