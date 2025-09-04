import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Field } from 'src/field/entities/field.entity';
import { Zone } from './entities/zone.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private zoneRepo: Repository<Zone>,

    @InjectRepository(Field)
    private fieldRepo: Repository<Field>,
  ) {}

  async create(createZoneDto: CreateZoneDto, fieldId: string) {
    const field = await this.fieldRepo.findOne({ where: { id: fieldId } });
    if (!field) throw new NotFoundException('Field not found');

    const zone = this.zoneRepo.create({
      ...createZoneDto,
      field,
    });

    return this.zoneRepo.save(zone);
  }

  async findAll(fieldId: string) {
    const field = await this.fieldRepo.findOne({ where: { id: fieldId } });
    if (!field) throw new NotFoundException('Field not found');

    const zone = await this.zoneRepo.find({
      where: {
        field: {
          id: field.id,
        },
      },
      relations: ['field', 'harvests'],
    });

    return zone;
  }

  async findOne(zoneId: string) {
    const zone = await this.zoneRepo.findOne({
      where: { id: zoneId },
      relations: ['field', 'harvests'], // si tu veux renvoyer le field aussi
    });

    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    return zone;
  }

  async update(zoneId: string, updateZoneDto: UpdateZoneDto) {
    const zone = await this.zoneRepo.findOne({ where: { id: zoneId } });
    if (!zone) throw new BadGatewayException('zone introuvable');

    Object.assign(zone, updateZoneDto);
    return this.zoneRepo.save(zone);
  }

  async remove(zoneId: string) {
    const zone = await this.zoneRepo.findOne({ where: { id: zoneId } });
    if (!zone) throw new BadGatewayException('zone introuvable');

    await this.zoneRepo.remove(zone);

    return { zoneId };
  }
}
