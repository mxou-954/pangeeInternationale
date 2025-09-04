import { Module } from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import { HarvestsController } from './harvests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harvest } from './entities/harvest.entity';
import { Field } from 'src/field/entities/field.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { Activities } from 'src/activities/entities/activity.entity';
import { Zone } from 'src/zones/entities/zone.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Farmer, Field, Harvest, Activities, Zone])], 
  controllers: [HarvestsController],
  providers: [HarvestsService],
})
export class HarvestsModule {}
