import { BadRequestException, Injectable, UnauthorizedException,  NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { Farmer } from './entities/farmer.entity';

@Injectable()
export class FarmerService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,
  ) {}

  create(createFarmerDto: CreateFarmerDto) {
    const farmer = this.farmerRepo.create(createFarmerDto);
    return this.farmerRepo.save(farmer);
  }
  

  findAll() {
    return this.farmerRepo.find();
  }

  async findOne(id: string) {
    const farmer = await this.farmerRepo.findOne({
      where : {id}
    })

    if(!farmer) {
      throw new UnauthorizedException("Le farmer est introuvable !")
    }

    return farmer;
  }

  async update(id: string, updateFarmerDto: UpdateFarmerDto) {
    const farmer = await this.farmerRepo.findOne({ where: { id } });
  
    if (!farmer) {
      throw new UnauthorizedException("Le farmeur est introuvable");
    }
  
    const updatedFarmer = Object.assign(farmer, updateFarmerDto);
  
    return this.farmerRepo.save(updatedFarmer);
  }  

  async setFav(id : string) {
    const farmer = await this.farmerRepo.findOne({ where: { id } });
  
    if (!farmer) {
      throw new UnauthorizedException("Le farmeur est introuvable");
    }

    if (farmer.isFavorite) {
      farmer.isFavorite = false
    } else {
      farmer.isFavorite = true
    }

    return this.farmerRepo.save(farmer)
  }

  async remove(id: string) {
    const farmer = await this.farmerRepo.findOneBy({ id });
  
    if (!farmer) {
      throw new NotFoundException("Impossible de trouver le farmer");
    }
  
    await this.farmerRepo.remove(farmer);
  
    return { id }; 
  }
}
