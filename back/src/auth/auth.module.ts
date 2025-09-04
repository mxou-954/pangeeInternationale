import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Admin } from './entities/loginAdmin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])], // utile si tu veux persister/faire évoluer
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
