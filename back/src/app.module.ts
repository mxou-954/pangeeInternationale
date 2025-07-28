import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // ✅ Bien importer ici
import { FarmerModule } from './farmer/farmer.module';
import { CommentsModule } from './comments/comments.module';
import { ActivityModule } from './activity/activity.module';
import { DocumentsModule } from './documents/documents.module';
import { LoginModule } from './login/login.module';
import { FieldModule } from './field/field.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Doit être en haut
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'pangeeInternationale',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }), FarmerModule, CommentsModule, ActivityModule, DocumentsModule, LoginModule, FieldModule,
  ],
  controllers: [],
})
export class AppModule {}
