import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Farmer, Member])], 
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
