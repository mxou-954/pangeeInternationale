import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuideService } from './guide.service';
import { GuideController } from './guide.controller';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { Guide } from './entities/guide.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Farmer, Guide])],
  controllers: [GuideController],
  providers: [GuideService],
})
export class GuideModule {}
