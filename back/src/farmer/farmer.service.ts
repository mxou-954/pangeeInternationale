import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { Farmer } from './entities/farmer.entity';
import { LocationVillage } from 'src/location-country/entities/location-village.entity';

@Injectable()
export class FarmerService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,

    @InjectRepository(LocationVillage)
    private villagesRepo: Repository<LocationVillage>,
  ) {}

  async create(createFarmerDto: CreateFarmerDto) {
    const villageRel = await this.villagesRepo.findOne({
      where: { id: createFarmerDto.village },
      relations: {
        commune: { region: { country: true } },
      },
    });
    if (!villageRel) {
      throw new NotFoundException('Village introuvable');
    }

    // 2) Snapshots sûrs
    const countryName = villageRel.commune?.region?.country?.name ?? null;
    const regionName = villageRel.commune?.region?.name ?? null;
    const communeName = villageRel.commune?.name ?? null;
    const villageName = villageRel.name;

    const farmer = this.farmerRepo.create({
      ...createFarmerDto,
      villageRel,
      // snapshots optionnels :
      countryName,
      regionName,
      communeName,
      villageName,
    });
    return this.farmerRepo.save(farmer);
  }

  findAll() {
    return this.farmerRepo.find();
  }

  async findOne(fieldId: string) {
    const farmer = await this.farmerRepo.findOne({
      where: { id: fieldId },
    });

    if (!farmer) {
      throw new UnauthorizedException('Le farmer est introuvable !');
    }

    return farmer;
  }

  async update(id: string, updateFarmerDto: UpdateFarmerDto) {
    const farmer = await this.farmerRepo.findOne({ where: { id } });

    if (!farmer) {
      throw new UnauthorizedException('Le farmeur est introuvable');
    }

    const updatedFarmer = Object.assign(farmer, updateFarmerDto);

    return this.farmerRepo.save(updatedFarmer);
  }

  async setFav(id: string) {
    const farmer = await this.farmerRepo.findOne({ where: { id } });

    if (!farmer) {
      throw new UnauthorizedException('Le farmeur est introuvable');
    }

    if (farmer.isFavorite) {
      farmer.isFavorite = false;
    } else {
      farmer.isFavorite = true;
    }

    return this.farmerRepo.save(farmer);
  }

  async remove(id: string) {
    const farmer = await this.farmerRepo.findOneBy({ id });

    if (!farmer) {
      throw new NotFoundException('Impossible de trouver le farmer');
    }

    await this.farmerRepo.remove(farmer);

    return { id };
  }
}
