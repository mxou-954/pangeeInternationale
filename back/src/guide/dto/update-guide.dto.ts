import { IsBoolean } from 'class-validator';

export class UpdateGuideDto {
  @IsBoolean()
  finish: boolean;
}