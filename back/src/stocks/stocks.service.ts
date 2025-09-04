import {
  BadGatewayException,
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>,

    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,
  ) {}

  async create(createStockDto: CreateStockDto, farmerId) {
    const farmer = await this.farmerRepo.findOne({
      where : {id : farmerId},
      relations : ['stocks']
    })

    if (!farmer) {
      throw new UnauthorizedException("Impossiible d'acceder aux stocks")
    }

    const stock = await this.stockRepo.create({
      ...createStockDto,
      farmer
    });

    return this.stockRepo.save(stock);
  }

  async findAll(farmerId : string) {
    const farmer = await this.farmerRepo.findOne({
      where : {id : farmerId},
      relations : ['stocks']
    })

    if (!farmer) {
      throw new UnauthorizedException("Impossiible d'acceder aux stocks")
    }

    const stock = farmer.stocks;

    return stock;
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  async update(itemId: string, updateStockDto: UpdateStockDto) {
    const item = await this.stockRepo.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new BadGatewayException("Impossible de trouver l'item en question");
    }

    const newQuantity = Number(updateStockDto.quantity);

    if (isNaN(newQuantity)) {
      throw new BadRequestException('Quantité invalide');
    }

    if (newQuantity < 0) {
      throw new BadRequestException('La quantité ne peut pas être négative');
    }

    item.quantity = newQuantity;

    const updated = await this.stockRepo.save(item);

    return updated;
  }

  async updateEverything(itemId: string, updateStockDto: UpdateStockDto) {
    const item = await this.stockRepo.findOne({ where: { id: itemId } });
    if (!item) throw new BadGatewayException('Item introuvable');

    Object.assign(item, updateStockDto);
    return this.stockRepo.save(item);
  }

  async remove(itemId: string) {
    const item = await this.stockRepo.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException("Impossible de trouver la l'iitem");
    }

    await this.stockRepo.remove(item);

    return { itemId };
  }
}
