import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';

@Controller('harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post(':fieldId')
  create(
    @Body() createHarvestDto: CreateHarvestDto,
    @Param('fieldId') fieldId: string,
  ) {
    return this.harvestsService.create(createHarvestDto, fieldId);
  }

  @Get(':fieldId')
  findAll(@Param('fieldId') fieldId: string) {
    return this.harvestsService.findAll(fieldId);
  }

  @Get('fromFarmer/:farmerId')
  findAllFromFarmer(@Param('farmerId') farmerId: string) {
    return this.harvestsService.findAllFromFarmer(farmerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.harvestsService.findOne(+id);
  }

  @Patch(':harvestId')
  update(
    @Param('harvestId') harvestId: string,
    @Body() updateHarvestDto: UpdateHarvestDto,
  ) {
    return this.harvestsService.update(harvestId, updateHarvestDto);
  }

  @Patch('closeHarvest/:fieldId/:harvestId')
  setHarvestClose(
    @Param('fieldId') fieldId: string,
    @Param('harvestId') harvestId: string,
  ) {
    return this.harvestsService.setHarvestClose(fieldId, harvestId)
  }

  @Delete(':harvestId')
  remove(@Param('harvestId') harvestId: string) {
    return this.harvestsService.remove(harvestId);
  }
}
