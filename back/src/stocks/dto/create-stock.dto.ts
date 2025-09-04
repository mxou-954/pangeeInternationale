import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  subcategory: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsString()
  unit: string;

  @IsString()
  purchasePrice: string;

  @IsString()
  supplier: string;

  @IsDateString()
  purchaseDate: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsString()
  storageLocation: string;

  @IsString()
  batchNumber: string;

    @IsString()
    alertStock: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
