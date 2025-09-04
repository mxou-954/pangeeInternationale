import { PartialType } from '@nestjs/mapped-types';
import { CreateActivitiesDto } from './create-activity.dto';

export class UpdateActivitesDto extends PartialType(CreateActivitiesDto) {}
