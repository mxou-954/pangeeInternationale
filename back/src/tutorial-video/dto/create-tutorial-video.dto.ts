// create-tutorial-video.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsArray,
  IsNumber,
  Max,
} from 'class-validator';
import { Difficulty } from '../entities/tutorial-video.entity';

export class CreateTutorialVideoDto {
  @IsString()
  @IsNotEmpty()
  iframe: string;

  @IsInt()
  @Min(0)
  duree: number; // secondes

  @IsString()
  @IsNotEmpty()
  formateur: string;

  @IsString()
  @IsNotEmpty()
  langue: string;

  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Difficulty)
  difficulte: Difficulty;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  note?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  vues?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  partage?: number;
}
