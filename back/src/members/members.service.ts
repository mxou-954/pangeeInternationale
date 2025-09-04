import { Injectable, UnauthorizedException, NotFoundException, BadGatewayException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
          @InjectRepository(Farmer)
          private farmerRepo: Repository<Farmer>,
    
          @InjectRepository(Member)
          private memberRepo: Repository<Member>,
  
        ) {}

  async create(createMemberDto: CreateMemberDto, farmerId : string) {
    const farmer = await this.farmerRepo.findOne({ where: { id: farmerId } });
          if (!farmer) throw new NotFoundException('Farmer not found');
        
    const members = this.memberRepo.create({
      ...createMemberDto,
      farmer,
    });
    
    return this.memberRepo.save(members);
  }

  async findAll(farmerId : string) {
      const members = await this.memberRepo.find({
    where: {
      farmer: { id: farmerId },
    },
    relations: ['farmer'],
  });

  return members;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  async update(memberId: string, updateMemberDto: UpdateMemberDto) {
  const member = await this.memberRepo.findOne({
    where: { id: memberId },
    relations: ['farmer'], // utile si tu veux garder le champ lié
  });

  if (!member) {
    throw new BadGatewayException("Impossible de trouver le membre");
  }

  // Met à jour uniquement les champs présents dans le DTO
  Object.assign(member, updateMemberDto);

  return this.memberRepo.save(member); // met à jour l'entité existante
  }

  async remove(memberId: string) {
    const member = await this.memberRepo.findOne({ 
      where : {id : memberId}
     });
  
    if (!member) {
      throw new NotFoundException("Impossible de trouver le membre");
    }
  
    await this.memberRepo.remove(member);
  
    return { memberId }; 
  }
}
