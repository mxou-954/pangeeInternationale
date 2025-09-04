import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Harvest } from './entities/harvest.entity';
import { Field } from 'src/field/entities/field.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { Zone } from 'src/zones/entities/zone.entity';

export interface PreviousCrop {
  harvestId: string;
  cropName?: string;
  varietyName?: string;
  closedAt: string; // ISO string
  zone?: {
    id?: string | null;
    name?: string | null;
    percentage?: number | null;
  };
}

@Injectable()
export class HarvestsService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,

    @InjectRepository(Field)
    private fieldRepo: Repository<Field>,

    @InjectRepository(Harvest)
    private harvestRepo: Repository<Harvest>,

    @InjectRepository(Zone)
    private zoneRepo: Repository<Zone>,
  ) {}

  async create(createHarvestDto: CreateHarvestDto, fieldId: string) {
    const { zone: zoneId, yieldTonnes, ...rest } = createHarvestDto;

    const harvest = this.harvestRepo.create({
      ...rest,
      // relations par ID (pas besoin de fetch si tu fais confiance aux IDs)
      field: fieldId ? ({ id: fieldId } as any) : null,
      zone: zoneId ? ({ id: zoneId } as any) : null,
      // cast numérique si besoin (voir entity/DTO plus bas)
      ...(yieldTonnes !== undefined
        ? { yieldTonnes: Number(yieldTonnes) }
        : {}),
    });

    return this.harvestRepo.save(harvest);
  }
  async findAll(fieldId: string) {
    const harvest = await this.harvestRepo.find({
      where: {
        field: { id: fieldId },
      },
      relations: ['field', 'zone'],
    });

    return harvest;
  }

    async findAllFromFarmer(farmerId: string) {
    const harvest = await this.harvestRepo.find({
      where: {
        farmer: {id: farmerId}
      },
      relations: ['field', 'zone'],
    });

    return harvest;
  }

  findOne(id: number) {
    return `This action returns a #${id} harvest`;
  }

  async update(harvestId: string, updateHarvestDto: UpdateHarvestDto) {
    const harvest = await this.harvestRepo.findOne({
      where: { id: harvestId },
      relations: ['field'], // utile si tu veux garder le champ lié
    });

    if (!harvest) {
      throw new BadGatewayException('Impossible de trouver la récolte');
    }

    // Met à jour uniquement les champs présents dans le DTO
    Object.assign(harvest, updateHarvestDto);

    return this.harvestRepo.save(harvest); // met à jour l'entité existante
  }

  async setHarvestClose(fieldId: string, harvestId: string) {
    const harvest = await this.harvestRepo.findOne({
      where: { id: harvestId },
      relations: { field: true, zone: true },
    });

    if (!harvest) throw new NotFoundException('Récolte introuvable');
    if (!harvest.field || harvest.field.id !== fieldId) {
      throw new BadRequestException(
        "Cette récolte n'appartient pas au champ indiqué",
      );
    }
    if (harvest.isEnd) {
      throw new BadRequestException('Cette récolte est déjà clôturée');
    }

    // 1) Clôture + snapshots
    harvest.isEnd = true;
    harvest.closedAt = new Date();
    harvest.zoneIdSnapshot = harvest.zone?.id;
    harvest.zoneNameSnapshot = harvest.zone?.name;
    harvest.zonePercentageSnapshot = harvest.zone?.percentage;
    harvest.fieldIdSnapshot = harvest.field?.id;

    // 2) Persiste la récolte
    const saved = await this.harvestRepo.save(harvest);

    // 3) Alimente l’historique du champ (avec un cap optionnel, par ex. 10 dernières)
    const field = await this.fieldRepo.findOne({ where: { id: fieldId } });
    if (!field) throw new NotFoundException('Champ introuvable');

    const percentageNum =
      saved.zonePercentageSnapshot == null
        ? null
        : Number(saved.zonePercentageSnapshot); // ou parseFloat

    const entry: PreviousCrop = {
      harvestId: saved.id,
      cropName: (saved as any).cropName ?? undefined,
      varietyName: (saved as any).varietyName ?? undefined,
      closedAt: saved.closedAt ? saved.closedAt.toISOString() : new Date().toISOString(),

      zone: {
        id: saved.zoneIdSnapshot ?? null,
        name: saved.zoneNameSnapshot ?? null,
        percentage: Number.isNaN(percentageNum) ? null : percentageNum,
      },
    };

    const max = 10;
    const current: PreviousCrop[] = field.previousCrops ?? [];
    field.previousCrops = [entry, ...current].slice(0, max);

    await this.fieldRepo.save(field);

    return {
      id: saved.id,
      isEnd: saved.isEnd,
      closedAt: saved.closedAt,
      zoneSnapshot: {
        id: saved.zoneIdSnapshot,
        name: saved.zoneNameSnapshot,
        percentage: saved.zonePercentageSnapshot,
      },
      fieldIdSnapshot: saved.fieldIdSnapshot,
    };
  }

  async remove(harvestId: string) {
    const harvest = await this.harvestRepo.findOne({
      where: { id: harvestId },
    });

    if (!harvest) {
      throw new NotFoundException('Impossible de trouver la cultrure');
    }

    await this.harvestRepo.remove(harvest);

    return { harvestId };
  }
}
