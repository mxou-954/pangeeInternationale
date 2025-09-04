import { Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from 'src/field/entities/field.entity';
import { Zone } from './entities/zone.entity';
import { Harvest } from 'src/harvests/entities/harvest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zone, Field, Harvest])],
  controllers: [ZonesController],
  providers: [ZonesService],
})
export class ZonesModule {}
