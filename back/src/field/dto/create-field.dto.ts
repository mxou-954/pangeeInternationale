import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsObject, 
  IsUUID
} from 'class-validator';

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
  cropType?: string;

  @IsOptional()
  @IsString()
  cropVariety?: string;

  @IsOptional()
  @IsString()
  plantingDate?: string;

  @IsOptional()
  @IsString()
  expectedHarvestDate?: string;

  @IsOptional()
  @IsArray()
  rotationPlan?: string[];

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
  previousCrops?: string[];

  @IsOptional()
  @IsString()
  averageYield?: number;

  @IsOptional()
  @IsString()
  lastPlowing?: string;

  @IsOptional()
  @IsString()
  lastFertilization?: string;

  @IsOptional()
  @IsString()
  expectedYield?: number;

  @IsOptional()
  @IsString()
  productionCost?: number;

  @IsOptional()
  @IsString()
  expectedRevenue?: number;

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
  @IsObject()
  sustainabilityGoals?: {
    waterReduction?: string;
    chemicalReduction?: string;
    carbonSequestration?: string;
    biodiversityIndex?: string;
  };

    @IsOptional()
  @IsUUID()
  farmerId?: string;

  @IsOptional()
@IsString() // ou @IsDateString() si tu veux le valider
createdDate?: string;

}
