// create-activity.dto.ts
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateActivitiesDto {
  @IsString()
  activityType: string;

  @IsUUID()
  field: string;

  @IsUUID()
  plantation?: string;

  @IsUUID()
  operator: string;

  @IsUUID()
  stock: string;

  @IsString()
  @IsOptional()
  quantity?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  @IsIn(['planned', 'in_progress', 'completed', 'cancelled'])
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
