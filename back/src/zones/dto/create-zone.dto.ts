import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateZoneDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  // string numérique 0–100 avec jusqu'à 2 décimales (ex: "12", "12.5", "99.99", "100")
  @IsOptional()
  @IsString()
  percentage?: string;

  // liaison à Field via son UUID (ManyToOne)
  @IsOptional()
  @IsUUID('4')
  fieldId?: string;
}
