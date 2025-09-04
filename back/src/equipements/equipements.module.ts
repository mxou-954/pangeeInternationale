import { Module } from '@nestjs/common';
import { EquipementsService } from './equipements.service';
import { EquipementsController } from './equipements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipement } from './entities/equipement.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Equipement, Farmer])], 
  controllers: [EquipementsController],
  providers: [EquipementsService],
})
export class EquipementsModule {}
