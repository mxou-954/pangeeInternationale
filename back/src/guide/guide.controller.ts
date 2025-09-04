import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { GuideModule } from './entities/guide.entity';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post(':farmerId')
  create(
    @Param('farmerId', new ParseUUIDPipe()) farmerId: string,
    @Body() dto: CreateGuideDto,
  ) {
    return this.guideService.create(dto, farmerId);
  }

  @Get(':farmerId')
  findAll(@Param('farmerId') farmerId: string) {
    return this.guideService.findAll(farmerId);
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.guideService.findOne(+id);
  }

  @Patch(':farmerId/:module')
  update(
    @Param('farmerId', new ParseUUIDPipe()) farmerId: string,
    @Param('module') module: GuideModule,
    @Body() dto: UpdateGuideDto,
  ) {
    return this.guideService.update(farmerId, module, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guideService.remove(+id);
  }
}
