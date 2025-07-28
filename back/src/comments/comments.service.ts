import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Injectable()
export class CommentsService {
    constructor(
      @InjectRepository(Comment)
      private commentsRepo: Repository<Comment>,

      @InjectRepository(Farmer)
      private farmerRepo: Repository<Farmer>,
    ) {}

  async create(createCommentDto: CreateCommentDto, farmerId: string) {
  const farmer = await this.farmerRepo.findOne({ where: { id: farmerId } });
  if (!farmer) {
    throw new UnauthorizedException("Impossible de trouver le farmer");
  }

  const admin = "Courbeyrette Maxime"

  const comment = this.commentsRepo.create({
    ...createCommentDto,
    farmer,
    admin
  });

  return await this.commentsRepo.save(comment);
  }

async findAll(farmerId: string) {
  const comments = await this.commentsRepo.find({
    where: {
      farmer: {
        id: farmerId,
      },
    },
    order: {
      createdAt: 'DESC',
    },
  });

  return comments;
}


  findOne(id: string) {
    return `This action returns a #${id} comment`;
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: string) {
    const comment = await this.commentsRepo.findOneBy({ id });
    
    if (!comment) {
      throw new NotFoundException("Impossible de trouver le commentaire");
    }

    await this.commentsRepo.remove(comment);

    return { id };
  }
}
