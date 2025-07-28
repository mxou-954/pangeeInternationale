import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post(":id")
  create(@Body() createFieldDto: CreateFieldDto, @Param('id') id: string) {
    return this.fieldService.create(createFieldDto, id);
  }

@Get(':id')
findAll(@Param('id') id: string) {
  if (!id) {
    throw new BadRequestException('Invalid farmer ID');
  }
  return this.fieldService.findAll(id);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldService.update(id, updateFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldService.remove(id);
  }
}
