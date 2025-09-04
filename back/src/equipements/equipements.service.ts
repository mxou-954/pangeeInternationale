import {
  BadGatewayException,
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipement } from './entities/equipement.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Injectable()
export class EquipementsService {
  constructor(
    @InjectRepository(Equipement)
    private EquipementRepo: Repository<Equipement>,

    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,
  ) {}

  async create(createEquipementDto: CreateEquipementDto, farmerId) {
    const farmer = await this.farmerRepo.findOne({
      where: { id: farmerId },
      relations: ['equipements'],
    });

    if (!farmer) {
      throw new UnauthorizedException("Impossiible d'acceder aux equipements");
    }

    const equipement = this.EquipementRepo.create({
      ...createEquipementDto,
      farmer,
    });

    return this.EquipementRepo.save(equipement);
  }

  async findAll(farmerId) {
    const farmer = await this.farmerRepo.findOne({
      where: { id: farmerId },
      relations: ['equipements'],
    });

    if (!farmer) {
      throw new UnauthorizedException("Impossiible d'acceder aux equipements");
    }

    const equipement = farmer.equipements;

    return equipement;
  }

  findOne(id: number) {
    return `This action returns a #${id} equipement`;
  }

  async update(itemId: string, updateEquipementDto: UpdateEquipementDto) {
    const item = await this.EquipementRepo.findOne({ where: { id: itemId } });
    if (!item) throw new BadGatewayException('Item introuvable');

    Object.assign(item, updateEquipementDto);
    return this.EquipementRepo.save(item);
  }

  async quickEdit(itemId: string, updateEquipementDto: UpdateEquipementDto) {
    const equipement = await this.EquipementRepo.findOne({
      where: { id: itemId },
    });

    if (!equipement) {
      throw new NotFoundException('Équipement non trouvé');
    }

    // Met à jour les champs simples
    if (updateEquipementDto.condition)
      equipement.condition = updateEquipementDto.condition;
    if (updateEquipementDto.notes) equipement.notes = updateEquipementDto.notes;
    if (updateEquipementDto.nextMaintenanceDate)
      equipement.nextMaintenanceDate = new Date(
        updateEquipementDto.nextMaintenanceDate,
      );

    // Gestion de la date de maintenance
    if (updateEquipementDto.maintenanceToday === true) {
      equipement.lastMaintenanceDate = new Date(); // aujourd'hui
    } else if (updateEquipementDto.lastMaintenanceDate) {
      equipement.lastMaintenanceDate = new Date(
        updateEquipementDto.lastMaintenanceDate,
      );
    }

    return this.EquipementRepo.save(equipement);
  }

  async remove(itemId: string) {
    const item = await this.EquipementRepo.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException("Impossible de trouver l'Equipement");
    }

    await this.EquipementRepo.remove(item);

    return { itemId };
  }
}
