import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Comment, Farmer])], 
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
