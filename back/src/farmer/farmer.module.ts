import { Module } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from './entities/farmer.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Login } from 'src/login/entities/login.entity';
import { Member } from 'src/members/entities/member.entity';
import { Guide } from 'src/guide/entities/guide.entity';
import { Harvest } from 'src/harvests/entities/harvest.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import { Equipement } from 'src/equipements/entities/equipement.entity';
import { Activities } from 'src/activities/entities/activity.entity';

import { BaseEntity } from 'src/location-country/entities/base.entity';
import { LocationCommune } from 'src/location-country/entities/location-commune.entity';
import { LocationCountry } from 'src/location-country/entities/location-country.entity';
import { LocationRegion } from 'src/location-country/entities/location-region.entity';
import { LocationVillage } from 'src/location-country/entities/location-village.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Farmer,
      BaseEntity,
      LocationCommune,
      LocationCountry,
      LocationRegion,
      LocationVillage,
      Harvest,
      Comment,
      Activity,
      Login,
      Member,
      Guide,
      Stock,
      Equipement,
      Activities,
    ]),
  ],
  controllers: [FarmerController],
  providers: [FarmerService],
})
export class FarmerModule {}
