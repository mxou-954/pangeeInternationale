import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsEnum, IsBoolean } from 'class-validator';
import { Farmer } from 'src/farmer/entities/farmer.entity';

export enum GuideModule {
  Fields = 'fields',
  Stocks = 'stocks',
  Activities = 'activities',
  Equipements = 'equipements',
  Ask = 'ask',
}

@Entity('guides')
export class Guide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: GuideModule,
  })
  @IsEnum(GuideModule)
  module: GuideModule;

  @Column({ default: false })
  @IsBoolean()
  finish: boolean;

  // Relation OneToOne avec Farmer
  @ManyToOne(() => Farmer, (farmer) => farmer.guides, { onDelete: 'CASCADE' })
  @JoinColumn()
  farmer: Farmer;
}
