import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivitiesDto } from './dto/create-activity.dto';
import { UpdateActivitesDto } from './dto/update-activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post(':farmerId')
  create(
    @Body() createActivitiesDto: CreateActivitiesDto,
    @Param('farmerId') farmerId: string,
  ) {
    return this.activitiesService.create(createActivitiesDto, farmerId);
  }

  @Get('all/:farmerId')
  findAll(@Param('farmerId') farmerId: string) {
    return this.activitiesService.findAll(farmerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }

  @Patch(':activityId')
  update(
    @Param('activityId') activityId: string,
    @Body() updateActivitiesDto: UpdateActivitesDto,
  ) {
    return this.activitiesService.update(activityId, updateActivitiesDto);
  }

  @Delete(':activityId')
  remove(@Param('activityId') activityId: string) {
    return this.activitiesService.remove(activityId);
  }
}
