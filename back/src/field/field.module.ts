import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from 'src/farmer/entities/farmer.entity'; 
import { Field } from './entities/field.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Farmer, Field])], 
  controllers: [FieldController],
  providers: [FieldService],
})
export class FieldModule {}
