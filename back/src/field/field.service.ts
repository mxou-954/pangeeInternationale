import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';
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

  async findAll(id: string) {
    const farmer = await this.farmerRepo.findOne({
      where: { id: id },
    });

    if (!farmer) {
      throw new BadGatewayException(
        'Impossible de trouver le farmer correspondant',
      );
    }

    const fields = await this.fieldRepo.find({
      where: {
        farmer: {
          id: farmer.id,
        },
      },
      relations: ['farmer', 'zones', 'harvest', 'activities'],
    });

    return fields;
  }

  async findOne(fieldId: string) {
    const field = await this.fieldRepo.findOne({
      where: { id: fieldId },
      relations: ['farmer', 'zones', 'harvest', 'activities'],
    });

    if (!field) {
      throw new NotFoundException('Le champs est introuvable !');
    }

    return field;
  }

  async update(fieldId: string, updateFieldDto: UpdateFieldDto) {
    const field = await this.fieldRepo.findOne({
      where : {id : fieldId}
    })

    if(!field){throw new BadRequestException("Champ Introuvable")}

    Object.assign(field, updateFieldDto);

    return this.fieldRepo.save(field)
  }

  async remove(fieldId: string) {
    const field = await this.fieldRepo.findOne({
      where : {id : fieldId}
    })

    if (!field) {
      throw new NotFoundException('Le champs est introuvable !');
    }

    await this.fieldRepo.remove(field);

    return { fieldId };
  }
}
