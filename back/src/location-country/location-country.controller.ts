import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LocationsService } from './location-country.service';
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

@Controller('locations')
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  // Countries
  @Get('countries')
  getCountries() {
    return this.service.getCountriesWithCounts();
  }

  @Post('countries')
  createCountry(@Body() dto: CreateLocationCountryDto) {
    return this.service.createCountry(dto);
  }

  @Patch('countries/:id')
  updateCountry(
    @Param('id') id: string,
    @Body() dto: UpdateLocationCountryDto,
  ) {
    return this.service.updateCountry(id, dto);
  }

  @Delete('countries/:id')
  deleteCountry(@Param('id') id: string) {
    return this.service.deleteCountry(id);
  }

  // Regions
  @Get('regions')
  listRegions(@Query('countryId') countryId: string) {
    return this.service.listRegionsByCountry(countryId);
  }

  @Post('regions')
  createRegion(@Body() dto: CreateRegionDto) {
    return this.service.createRegion(dto);
  }

  @Patch('regions/:id')
  updateRegion(@Param('id') id: string, @Body() dto: UpdateRegionDto) {
    return this.service.updateRegion(id, dto);
  }

  @Delete('regions/:id')
  deleteRegion(@Param('id') id: string) {
    return this.service.deleteRegion(id);
  }

  // Communes
  @Get('communes')
  listCommunes(@Query('regionId') regionId?: string) {
    if (!regionId) throw new BadRequestException('regionId is required');
    // éventuellement: if (!validateUUID(regionId)) throw new BadRequestException('Invalid regionId');
    return this.service.listCommunesByRegion(regionId);
  }

  @Post('communes')
  createCommune(@Body() dto: CreateCommuneDto) {
    return this.service.createCommune(dto);
  }

  @Patch('communes/:id')
  updateCommune(@Param('id') id: string, @Body() dto: UpdateCommuneDto) {
    return this.service.updateCommune(id, dto);
  }

  @Delete('communes/:id')
  deleteCommune(@Param('id') id: string) {
    return this.service.deleteCommune(id);
  }

  // Villages
  @Get('villages')
  listVillages(@Query('communeId') communeId: string) {
    return this.service.listVillagesByCommune(communeId);
  }

  @Post('villages')
  createVillage(@Body() dto: CreateVillageDto) {
    return this.service.createVillage(dto);
  }

  @Patch('villages/:id')
  updateVillage(@Param('id') id: string, @Body() dto: UpdateVillageDto) {
    return this.service.updateVillage(id, dto);
  }

  @Delete('villages/:id')
  deleteVillage(@Param('id') id: string) {
    return this.service.deleteVillage(id);
  }

  // Payload complet pour ton UI
  @Get('payload')
  getPayload() {
    return this.service.getLocationsPayload();
  }
}
