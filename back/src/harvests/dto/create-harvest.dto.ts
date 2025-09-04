import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHarvestDto {
  @IsString() cropType: string;

  @IsOptional() @IsDateString() plantingDate?: string;
  @IsOptional() @IsDateString() harvestDate?: string;
  @IsOptional() @IsString() variety?: string;

  // UUID envoyé par le front
  @IsOptional()
  @IsUUID()
  zone?: string;

  @IsOptional() @IsString() pesticidesUsed?: string;
  @IsOptional() @IsString() problemsEncountered?: string;

  // envoie souvent une string depuis le front -> on cast côté service
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yieldTonnes?: number;

  @IsOptional() @IsString() harvestQuality?: string;
  @IsOptional() @IsString() notes?: string;
}
