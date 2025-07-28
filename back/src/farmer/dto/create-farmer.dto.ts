import { IsString, IsBoolean, IsOptional, IsEmail } from 'class-validator';

export class CreateFarmerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  country: string;

  @IsString()
  region: string;

  @IsString()
  commune: string;

  @IsString()
  village: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsString()
  status: string;
}
