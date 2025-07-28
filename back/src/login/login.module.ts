import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Module({
    imports:  [TypeOrmModule.forFeature([Farmer, Login])], 
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
