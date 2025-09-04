import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { Login } from './entities/login.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepo: Repository<Farmer>,

    @InjectRepository(Login)
    private loginRepo: Repository<Login>, 
  ) {}

async create(createLoginDto: CreateLoginDto) {
  const farmer = await this.farmerRepo.findOne({
    where: {
      country: createLoginDto.country,
      region: createLoginDto.region,
      commune: createLoginDto.commune,
      village: createLoginDto.village,
      code: createLoginDto.code,
    },
  });

  if (!farmer) {
    throw new UnauthorizedException("Il manque une métrique ou une métrique est incorrecte");
  }

  const login = this.loginRepo.create({
    ...createLoginDto,
    farmer, // relation directe
  });

  await this.loginRepo.save(login);

  return farmer;
}


  findAll() {
    return `This action returns all login`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }

  update(id: number, updateLoginDto: UpdateLoginDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
