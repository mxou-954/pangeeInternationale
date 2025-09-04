import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // ✅ Bien importer ici
import { FarmerModule } from './farmer/farmer.module';
import { CommentsModule } from './comments/comments.module';
import { ActivityModule } from './activity/activity.module';
import { DocumentsModule } from './documents/documents.module';
import { LoginModule } from './login/login.module';
import { FieldModule } from './field/field.module';
import { HarvestsModule } from './harvests/harvests.module';
import { MembersModule } from './members/members.module';
import { StocksModule } from './stocks/stocks.module';
import { EquipementsModule } from './equipements/equipements.module';
import { ActivitiesModule } from './activities/activities.module';
import { ZonesModule } from './zones/zones.module';
import { GuideModule } from './guide/guide.module';
import { LocationCountryModule } from './location-country/location-country.module';
import { TutorialVideoModule } from './tutorial-video/tutorial-video.module';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/auth.module';

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
    }),
    FarmerModule,
    CommentsModule,
    ActivityModule,
    DocumentsModule,
    LoginModule,
    FieldModule,
    HarvestsModule,
    MembersModule,
    StocksModule,
    EquipementsModule,
    ActivitiesModule,
    ZonesModule,
    GuideModule,
    LocationCountryModule,
    TutorialVideoModule,
    LocationModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
