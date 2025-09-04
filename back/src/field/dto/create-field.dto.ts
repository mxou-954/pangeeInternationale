import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsObject, 
  IsUUID,
  IsDateString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class PreviousCropDto {
  @IsString()
  harvestId: string;

  @IsOptional()
  @IsString()
  cropName?: string;

  @IsOptional()
  @IsString()
  varietyName?: string;

  @IsDateString()
  closedAt: string; // ex: "2025-08-26T12:34:56.000Z"

  @IsOptional()
  @IsObject()
  zone?: {
    id?: string | null;
    name?: string | null;
    percentage?: number | null;
  };
}


export class CreateFieldDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  size?: number;

  @IsOptional()
  @IsObject()
  coordinates?: { latitude: string; longitude: string };

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  altitude?: number;

  @IsOptional()
  @IsString()
  slope?: number;

  @IsOptional()
  @IsString()
  exposition?: string;

  @IsOptional()
  @IsString()
  soilType?: string;

  @IsOptional()
  @IsString()
  soilPH?: number;

  @IsOptional()
  @IsString()
  soilQuality?: string;

  @IsOptional()
  @IsString()
  drainage?: string;

  @IsOptional()
  @IsString()
  organicMatter?: number;

  @IsOptional()
  @IsString()
  lastSoilAnalysis?: string;

  @IsOptional()
  @IsString()
  plantingDate?: string;

  @IsOptional()
  @IsString()
  expectedHarvestDate?: string;

  @IsOptional()
  @IsString()
  irrigationSystem?: string;

  @IsOptional()
  @IsString()
  irrigationCapacity?: string;

  @IsOptional()
  @IsString()
  waterSource?: string;

  @IsOptional()
  @IsBoolean()
  fencing?: boolean;

  @IsOptional()
  @IsString()
  storage?: string;

  @IsOptional()
  @IsString()
  accessibility?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreviousCropDto)   // important pour bien transformer JSON → class
  previousCrops?: PreviousCropDto[];

  @IsOptional()
  @IsString()
  lastPlowing?: string;

  @IsOptional()
  @IsString()
  lastFertilization?: string;

  @IsOptional()
  @IsArray()
  climateRisks?: string[];

  @IsOptional()
  @IsArray()
  pestRisks?: string[];

  @IsOptional()
  @IsArray()
  diseaseHistory?: string[];

  @IsOptional()
  @IsString()
  ownershipType?: string;

  @IsOptional()
  @IsObject()
  lease?: { startDate?: string; endDate?: string; cost?: string };

  @IsOptional()
  @IsArray()
  certifications?: string[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;

    @IsOptional()
  @IsUUID()
  farmerId?: string;

  @IsOptional()
@IsString() // ou @IsDateString() si tu veux le valider
createdDate?: string;

}
