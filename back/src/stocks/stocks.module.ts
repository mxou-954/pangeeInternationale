import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Activities } from 'src/activities/entities/activity.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Stock, Activities, Farmer])], 
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
