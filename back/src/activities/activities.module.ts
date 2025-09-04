import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Activities } from './entities/activity.entity';
import { Field } from 'src/field/entities/field.entity';
import { Harvest } from 'src/harvests/entities/harvest.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import { Member } from 'src/members/entities/member.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer, Activities, Field, Harvest, Stock, Member])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
