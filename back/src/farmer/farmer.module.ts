import { Module } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farmer } from './entities/farmer.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Login } from 'src/login/entities/login.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Farmer, Comment, Activity, Login])], 
  controllers: [FarmerController],
  providers: [FarmerService],
})
export class FarmerModule {}
