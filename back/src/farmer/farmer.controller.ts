import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';

@Controller('farmer')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Post()
  create(@Body() createFarmerDto: CreateFarmerDto) {
    return this.farmerService.create(createFarmerDto);
  }

  @Get()
  findAll() {
    return this.farmerService.findAll();
  }

  @Get(':fieldId')
  findOne(@Param('fieldId') fieldId: string) {
    return this.farmerService.findOne(fieldId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFarmerDto: UpdateFarmerDto) {
    return this.farmerService.update(id, updateFarmerDto);
  }

  @Patch('fav/:id')
  fav(@Param('id') id : string) {
    return this.farmerService.setFav(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmerService.remove(id);
  }
}
 