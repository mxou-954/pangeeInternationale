import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EquipementsService } from './equipements.service';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';

@Controller('equipements')
export class EquipementsController {
  constructor(private readonly equipementsService: EquipementsService) {}

  @Post(':farmerId')
  create(
    @Body() createEquipementDto: CreateEquipementDto,
    @Param('farmerId') farmerId: string,
  ) {
    return this.equipementsService.create(createEquipementDto, farmerId);
  }

  @Get('all/:farmerId')
  findAll(@Param('farmerId') farmerId: string) {
    return this.equipementsService.findAll(farmerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') itemId: string,
    @Body() updateEquipementDto: UpdateEquipementDto,
  ) {
    return this.equipementsService.update(itemId, updateEquipementDto);
  }

  @Patch('quickEdit/:id')
  async quickEdit(
    @Param('id') itemId: string,
    @Body() updateEquipementDto: UpdateEquipementDto,
  ) {
    return this.equipementsService.quickEdit(itemId, updateEquipementDto);
  }

  @Delete(':itemId')
  remove(@Param('itemId') itemId: string) {
    return this.equipementsService.remove(itemId);
  }
}
