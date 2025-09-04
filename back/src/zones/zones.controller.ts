import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post(':fieldId')
  create(@Body() createZoneDto: CreateZoneDto, @Param('fieldId') fieldId: string) {
    return this.zonesService.create(createZoneDto, fieldId);
  }

  @Get(':fieldId')
  findAll(@Param('fieldId') fieldId: string) {
    return this.zonesService.findAll(fieldId);
  }

  @Get('one/:zoneId')
  findOne(@Param('zoneId') zoneId: string) {
    return this.zonesService.findOne(zoneId);
  }

  @Patch(':zoneId')
  update(@Param('zoneId') zoneId: string, @Body() updateZoneDto: UpdateZoneDto) {
    return this.zonesService.update(zoneId, updateZoneDto);
  }

  @Delete(':zoneId')
  remove(@Param('zoneId') zoneId: string) {
    return this.zonesService.remove(zoneId);
  }
}
