import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Post(':farmerId')
  create(
    @Body() createStockDto: CreateStockDto,
    @Param('farmerId') farmerId: string,
  ) {
    return this.stocksService.create(createStockDto, farmerId);
  }

  @Get('all/:farmerId')
  findAll(@Param('farmerId') farmerId: string) {
    return this.stocksService.findAll(farmerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stocksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') itemId: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stocksService.update(itemId, updateStockDto);
  }

  @Put('everything/:id')
  updateEverything(@Param('id') itemId: string, @Body() body: any) {
    const { id, createdAt, updatedAt, ...cleanBody } = body;
    return this.stocksService.updateEverything(itemId, cleanBody);
  }

  @Delete(':itemId')
  remove(@Param('itemId') itemId: string) {
    return this.stocksService.remove(itemId);
  }
}
