import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Activity, Farmer])], 
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
