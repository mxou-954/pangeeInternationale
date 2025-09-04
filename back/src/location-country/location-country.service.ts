import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LocationCountry } from './entities/location-country.entity';
import { LocationRegion } from './entities/location-region.entity';
import { LocationCommune } from './entities/location-commune.entity';
import { LocationVillage } from './entities/location-village.entity';
import { CreateLocationCountryDto } from './dto/create-location-country.dto';
import { UpdateLocationCountryDto } from './dto/update-location-country.dto';
import {
  CreateRegionDto,
  UpdateRegionDto,
  CreateCommuneDto,
  UpdateCommuneDto,
  CreateVillageDto,
  UpdateVillageDto,
} from './dto/simple.dto';
import { Farmer } from 'src/farmer/entities/farmer.entity';

type Level = 'country' | 'region' | 'commune' | 'village';

@Injectable()
export class LocationsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(LocationCountry)
    private countries: Repository<LocationCountry>,
    @InjectRepository(LocationRegion)
    private regions: Repository<LocationRegion>,
    @InjectRepository(LocationCommune)
    private communes: Repository<LocationCommune>,
    @InjectRepository(LocationVillage)
    private villages: Repository<LocationVillage>,
    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,
  ) {}

  // ── Countries ──────────────────────────────────────────────────────────────
  async createCountry(dto: CreateLocationCountryDto) {
    const exists = await this.countries.findOne({
      where: [{ code: dto.code }, { name: dto.name }],
    });
    if (exists)
      throw new Error('Country with same code or name already exists');
    return this.countries.save(this.countries.create(dto));
  }

  async updateCountry(id: string, dto: UpdateLocationCountryDto) {
    await this.countries.update(id, dto);
    const updated = await this.countries.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Country not found');

    // Farmers où country = id
    const farmers = await this.farmerRepo.find({ where: { country: id } });
    for (const f of farmers) f.countryName = dto.name || "";
    if (farmers.length) await this.farmerRepo.save(farmers);

    return { updated, farmersAffected: farmers.length };
  }

  async deleteCountry(id: string) {
    await this.countries.delete(id);
    return { success: true };
  }

  async getCountriesWithCounts() {
    // One efficient aggregated query returning counts per niveau
    const qb = this.countries
      .createQueryBuilder('country')
      .leftJoin('country.regions', 'region')
      .leftJoin('region.communes', 'commune')
      .leftJoin('commune.villages', 'village')
      .select('country.id', 'id')
      .addSelect('country.name', 'name')
      .addSelect('country.code', 'code')
      .addSelect('country.emojiFlag', 'emojiFlag')
      .addSelect('COUNT(DISTINCT region.id)', 'regionsCount')
      .addSelect('COUNT(DISTINCT commune.id)', 'communesCount')
      .addSelect('COUNT(DISTINCT village.id)', 'villagesCount')
      .groupBy('country.id');

    const rows = await qb.getRawMany();

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      flag: r.emojiFlag,
      count: {
        regions: Number(r.regionsCount || 0),
        communes: Number(r.communesCount || 0),
        villages: Number(r.villagesCount || 0),
      },
    }));
  }

  // ── Regions ───────────────────────────────────────────────────────────────
  async createRegion(dto: CreateRegionDto) {
    const country = await this.countries.findOne({
      where: { id: dto.countryId },
    });
    if (!country) throw new NotFoundException('Country not found');
    return this.regions.save(
      this.regions.create({ name: dto.name, countryId: country.id }),
    );
  }

  async listRegionsByCountry(countryId: string) {
    const list = await this.regions.find({ where: { countryId } });

    // counts per region
    const counts = await this.regions
      .createQueryBuilder('r')
      .leftJoin('r.communes', 'c')
      .leftJoin('c.villages', 'v')
      .select('r.id', 'id')
      .addSelect('COUNT(DISTINCT c.id)', 'communes')
      .addSelect('COUNT(DISTINCT v.id)', 'villages')
      .where('r.countryId = :countryId', { countryId })
      .groupBy('r.id')
      .getRawMany();

    const map = new Map(counts.map((x) => [x.id, x]));

    return list.map((r) => ({
      id: r.id,
      name: r.name,
      count: {
        communes: Number(map.get(r.id)?.communes || 0),
        villages: Number(map.get(r.id)?.villages || 0),
      },
    }));
  }

  async updateRegion(id: string, dto: UpdateRegionDto) {
  await this.regions.update(id, dto);
  const updated = await this.regions.findOne({ where: { id } });
  if (!updated) throw new NotFoundException('Region not found');

  const farmers = await this.farmerRepo.find({ where: { region: id } });
  for (const f of farmers) f.regionName = dto.name || "";
  if (farmers.length) await this.farmerRepo.save(farmers);

  return { updated, farmersAffected: farmers.length };
}

  async deleteRegion(id: string) {
    await this.regions.delete(id);
    return { success: true };
  }

  // ── Communes ──────────────────────────────────────────────────────────────
  async createCommune(dto: CreateCommuneDto) {
    const region = await this.regions.findOne({ where: { id: dto.regionId } });
    if (!region) throw new NotFoundException('Region not found');
    return this.communes.save(
      this.communes.create({ name: dto.name, regionId: region.id }),
    );
  }

  async listCommunesByRegion(regionId: string) {
    const list = await this.communes.find({ where: { regionId } });
    const counts = await this.communes
      .createQueryBuilder('c')
      .leftJoin('c.villages', 'v')
      .select('c.id', 'id')
      .addSelect('COUNT(v.id)', 'villages')
      .where('c.regionId = :regionId', { regionId })
      .groupBy('c.id')
      .getRawMany();

    const map = new Map(counts.map((x) => [x.id, x]));

    return list.map((c) => ({
      id: c.id,
      name: c.name,
      count: { villages: Number(map.get(c.id)?.villages || 0) },
    }));
  }

  async updateCommune(id: string, dto: UpdateCommuneDto) {
  await this.communes.update(id, dto);
  const updated = await this.communes.findOne({ where: { id } });
  if (!updated) throw new NotFoundException('Commune not found');

  const farmers = await this.farmerRepo.find({ where: { commune: id } });
  for (const f of farmers) f.communeName = dto.name || "";
  if (farmers.length) await this.farmerRepo.save(farmers);

  return { updated, farmersAffected: farmers.length };
}

  async deleteCommune(id: string) {
    await this.communes.delete(id);
    return { success: true };
  }

  // ── Villages ──────────────────────────────────────────────────────────────
  async createVillage(dto: CreateVillageDto) {
    const commune = await this.communes.findOne({
      where: { id: dto.communeId },
    });
    if (!commune) throw new NotFoundException('Commune not found');
    return this.villages.save(
      this.villages.create({ name: dto.name, communeId: commune.id }),
    );
  }

  async listVillagesByCommune(communeId: string) {
    return this.villages.find({ where: { communeId } });
  }

  async updateVillage(id: string, dto: UpdateVillageDto) {
  await this.villages.update(id, dto);
  const updated = await this.villages.findOne({ where: { id } });
  if (!updated) throw new NotFoundException('Village not found');

  const farmers = await this.farmerRepo.find({ where: { village: id } });
  for (const f of farmers) f.villageName = dto.name || "";
  if (farmers.length) await this.farmerRepo.save(farmers);

  return { updated, farmersAffected: farmers.length };
}

  async deleteVillage(id: string) {
    await this.villages.delete(id);
    return { success: true };
  }

  // ── Tree builder tailored for your frontend structure ─────────────────────
  // Structure attendue côté UI (d'après ton snippet):
  // {
  // countries: [{ id, name, code, flag, count: { regions, communes, villages } }],
  // regions: { [countryId]: [{ id, name, count: { communes, villages } }] },
  // communes: { [regionId]: [{ id, name, count: { villages } }] },
  // villages: { [communeId]: [{ id, name }] }
  // }
  async getLocationsPayload() {
    const countries = await this.getCountriesWithCounts();

    // Regions grouped by country
    const regionRows = await this.regions.find();
    const regionsByCountry: Record<string, any[]> = {};
    for (const r of regionRows) {
      const counts = await this.regions
        .createQueryBuilder('r')
        .leftJoin('r.communes', 'c')
        .leftJoin('c.villages', 'v')
        .select('COUNT(DISTINCT c.id)', 'communes')
        .addSelect('COUNT(DISTINCT v.id)', 'villages')
        .where('r.id = :id', { id: r.id })
        .getRawOne();
      if (!regionsByCountry[r.countryId]) regionsByCountry[r.countryId] = [];
      regionsByCountry[r.countryId].push({
        id: r.id,
        name: r.name,
        countryId: r.countryId,
        count: {
          communes: Number(counts?.communes || 0),
          villages: Number(counts?.villages || 0),
        },
      });
    }

    // Communes grouped by region
    const communeRows = await this.communes.find();
    const communesByRegion: Record<string, any[]> = {};
    for (const c of communeRows) {
      const villagesCount = await this.villages.count({
        where: { communeId: c.id },
      });
      if (!communesByRegion[c.regionId]) communesByRegion[c.regionId] = [];
      communesByRegion[c.regionId].push({
        id: c.id,
        name: c.name,
        regionId: c.regionId,
        count: { villages: villagesCount },
      });
    }

    // Villages grouped by commune
    const villageRows = await this.villages.find();
    const villagesByCommune: Record<string, any[]> = {};
    for (const v of villageRows) {
      if (!villagesByCommune[v.communeId]) villagesByCommune[v.communeId] = [];
      villagesByCommune[v.communeId].push({ id: v.id, name: v.name });
    }

    return {
      countries,
      regions: regionsByCountry,
      communes: communesByRegion,
      villages: villagesByCommune,
    };
  }
}
