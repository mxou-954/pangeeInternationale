import {
  IsString,
  IsDateString,
  IsEmail,
  IsOptional,
  IsIn,
  IsNumber,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';


class EmergencyContactDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  relationship: string;
}

export class CreateMemberDto {
  // Informations personnelles
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  gender: string;

  @IsString()
  nationalId: string;

  // Coordonnées
  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact: EmergencyContactDto;

  // Informations professionnelles
  @IsString()
  position: string;

  @IsString()
  department: string;

  @IsIn(['permanent', 'saisonnier', 'temporaire', 'stage', 'other'])
employmentType: 'permanent' | 'saisonnier' | 'temporaire' | 'stage' | 'other';

  @IsDateString()
  startDate: string;

@IsOptional()
@IsDateString()
@Transform(({ value }) => value === '' ? undefined : value)
endDate?: string;


  @IsString()
  workSchedule: string;

  // Rémunération
@IsIn(['horaire', 'journalier', 'mensuel', 'tache', 'other'])
salaryType: 'horaire' | 'journalier' | 'mensuel' | 'tache' | 'other';

  @IsString()
  salary: string;

  @IsString()
  currency: string;

  @IsString()
  paymentMethod: string;

  // Compétences et formation
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @IsString({ each: true })
  certifications: string[];

  @IsString()
  experience: string;

  @IsArray()
  @IsString({ each: true })
  languages: string[];

  // Statut et permissions
@IsOptional()
@IsIn(['active', 'inactive', 'on_leave'])
status?: 'active' | 'inactive' | 'on_leave';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

@IsOptional()
@IsIn(['worker', 'supervisor', 'manager'])
accessLevel?: 'worker' | 'supervisor' | 'manager';

  // Informations supplémentaires
  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}
