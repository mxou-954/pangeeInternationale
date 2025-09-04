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


@Get('one/:fieldId')
async findOne(@Param('fieldId') fieldId: string) {
  try {
    console.log("fieldId reçu :", fieldId);
    return await this.fieldService.findOne(fieldId);
  } catch (err) {
    console.error("Erreur dans controller findOne:", err);
    throw err;
  }
}


  @Patch(':fieldId')
  update(@Param('fieldId') fieldId: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldService.update(fieldId, updateFieldDto);
  }

  @Delete(':fieldId')
  remove(@Param('fieldId') fieldId: string) {
    return this.fieldService.remove(fieldId);
  }
}
