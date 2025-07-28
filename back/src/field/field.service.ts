import { Injectable, UnauthorizedException, NotFoundException, BadGatewayException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { Field } from './entities/field.entity';

@Injectable()
export class FieldService {
    constructor(
      @InjectRepository(Farmer)
      private farmerRepo: Repository<Farmer>,

      @InjectRepository(Field)
      private fieldRepo: Repository<Field>,
    ) {}

async create(createFieldDto: CreateFieldDto, farmerId: string) {
  const farmer = await this.farmerRepo.findOne({ where: { id: farmerId } });
  if (!farmer) throw new NotFoundException('Farmer not found');

  const field = this.fieldRepo.create({
    ...createFieldDto,
    farmer, // <== on passe l'entité Farmer, pas juste l'id
  });

  return this.fieldRepo.save(field);
}


  async findAll(id : string) {
    const farmer = await this.farmerRepo.findOne({
      where : {id : id}
    })


    if(!farmer) {
      throw new BadGatewayException("Impossible de trouver le farmer correspondant")
    }

const fields = await this.fieldRepo.find({
  where: {
    farmer: {
      id: farmer.id
    }
  },
  relations: ['farmer']
});
   
    if (fields.length === 0) {
  throw new NotFoundException("Aucun champ trouvé pour ce farmer");
}

    return fields;
  }

  async findOne(id: string) {
     const field = await this.fieldRepo.findOne({
       where : {id}
     })
 
     if(!field) {
       throw new UnauthorizedException("Le farmer est introuvable !")
     }
 
     return field;
  }

  update(id: string, updateFieldDto: UpdateFieldDto) {
    return `This action updates a #${id} field`;
  }

  remove(id: string) {
    return `This action removes a #${id} field`;
  }
}
