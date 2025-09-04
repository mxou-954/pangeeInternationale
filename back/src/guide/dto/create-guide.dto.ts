// dto/create-guide.dto.ts
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { GuideModule } from '../entities/guide.entity';

export class CreateGuideDto {
  @IsEnum(GuideModule)
  module: GuideModule;

  @IsOptional()
  @IsBoolean()
  finish?: boolean = false;
}