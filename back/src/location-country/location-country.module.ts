import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationCountry } from './entities/location-country.entity';
import { LocationRegion } from './entities/location-region.entity';
import { LocationCommune } from './entities/location-commune.entity';
import { LocationVillage } from './entities/location-village.entity';
import { LocationsService } from './location-country.service';
import { LocationsController } from './location-country.controller';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LocationCountry,
      LocationRegion,
      LocationCommune,
      LocationVillage,
      Farmer,
    ]),
  ],
  providers: [LocationsService],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationCountryModule {}
