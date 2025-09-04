import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateActivitiesDto } from './dto/create-activity.dto';
import { UpdateActivitesDto } from './dto/update-activity.dto';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Activities } from './entities/activity.entity';
import { Field } from 'src/field/entities/field.entity';
import { Harvest } from 'src/harvests/entities/harvest.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import { Member } from 'src/members/entities/member.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>,

    @InjectRepository(Activities)
    private activitiesRepo: Repository<Activities>,

    @InjectRepository(Field)
    private fieldRepo: Repository<Field>,

    @InjectRepository(Harvest)
    private harvestRepo: Repository<Harvest>,

    @InjectRepository(Member)
    private memberRepo: Repository<Member>,

    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,
  ) {}

  async create(createActivitiesDto: CreateActivitiesDto, farmerId) {
    const farmer = await this.farmerRepo.findOne({
      where: { id: farmerId },
      relations: ['activitiesFarm'],
    });

    if (!farmer) {
      throw new UnauthorizedException("Impossiible d'acceder aux activités");
    }

    const field = await this.fieldRepo.findOneByOrFail({
      id: createActivitiesDto.field,
    });

    const operator = await this.memberRepo.findOneByOrFail({
      id: createActivitiesDto.operator,
    });

    const harvest = await this.harvestRepo.findOneByOrFail({
      id: createActivitiesDto.plantation,
    });

    const stock = await this.stockRepo.findOneByOrFail({
      id: createActivitiesDto.stock,
    });

    const activity = this.activitiesRepo.create({
      ...createActivitiesDto,
      field,
      operator,
      plantation: harvest,
      stock,
      farmer,
    });

    const newStockQuantity =
      Number(stock.quantity) - Number(createActivitiesDto.quantity);
    if (newStockQuantity < 0) {
      throw new BadRequestException('Stock insuffisant pour cette activité.');
    }
    stock.quantity = newStockQuantity;

    const savedActivity = await this.activitiesRepo.save(activity);
    await this.stockRepo.save(stock);

    return savedActivity;
  }

  async findAll(farmerId) {
    const farmer = await this.farmerRepo.findOne({
      where: { id: farmerId },
      relations: ['activitiesFarm'],
    });

    if (!farmer) {
      throw new UnauthorizedException("Impossiible d'acceder aux activités");
    }

    const activities = farmer.activitiesFarm;

    return activities;
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  async update(activityId: string, updateActivitiesDto: UpdateActivitesDto) {
    const activity = await this.activitiesRepo.findOne({
      where: { id: activityId },
      relations: ['stock'],
    });

    if (!activity) throw new BadGatewayException('Activité introuvable');

    const stock = await this.stockRepo.findOneByOrFail({
      id: activity.stock.id,
    });

    const oldQty = Number(activity.quantity) || 0;
    const newQty = Number(updateActivitiesDto.quantity) || 0;

    // 🧠 Remettre l'ancienne quantité au stock
    stock.quantity += oldQty;

    // 🔁 Puis retirer la nouvelle
    if (stock.quantity < newQty) {
      throw new BadRequestException('Stock insuffisant pour cette mise à jour');
    }

    stock.quantity -= newQty;

    // ✅ Mettre à jour l'activité
    Object.assign(activity, updateActivitiesDto);

    await this.stockRepo.save(stock);
    return this.activitiesRepo.save(activity);
  }

  async remove(activityId: string) {
    const activity = await this.activitiesRepo.findOne({
      where: { id: activityId },
      relations: ['stock'],
    });

    if (!activity) throw new BadGatewayException('Activité introuvable');

    const stock = await this.stockRepo.findOneByOrFail({
      id: activity.stock.id,
    });

    const oldQty = Number(activity.quantity) || 0;

    // 🧠 Remettre l'ancienne quantité au stock
    stock.quantity += oldQty;

    return this.activitiesRepo.remove(activity);
  }
}
