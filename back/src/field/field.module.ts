import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from 'src/farmer/entities/farmer.entity'; 
import { Field } from './entities/field.entity';
import { Activities } from 'src/activities/entities/activity.entity';
import { Zone } from 'src/zones/entities/zone.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Farmer, Field, Activities, Zone])], 
  controllers: [FieldController],
  providers: [FieldService],
})
export class FieldModule {}
