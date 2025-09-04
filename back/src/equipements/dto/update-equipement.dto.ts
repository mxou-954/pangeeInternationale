import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipementDto } from './create-equipement.dto';

export class UpdateEquipementDto extends PartialType(CreateEquipementDto) {}
