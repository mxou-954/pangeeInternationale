import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsEnum(['message', 'document', 'profile_update', 'visit', 'comment', "commentDelete"])
  type: 'message' | 'document' | 'profile_update' | 'visit' | 'comment' | "commentDelete";

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  author?: string;
}

