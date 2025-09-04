import { PartialType } from '@nestjs/mapped-types';
import { CreateTutorialVideoDto } from './create-tutorial-video.dto';

export class UpdateTutorialVideoDto extends PartialType(CreateTutorialVideoDto) {}
