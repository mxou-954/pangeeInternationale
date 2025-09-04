// src/login/dto/create-login.dto.ts
import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateLoginDto {

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  commune: string;

  @IsString()
  @IsNotEmpty()
  village: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
