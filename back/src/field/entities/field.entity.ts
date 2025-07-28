import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  ManyToOne
} from 'typeorm';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { UUID } from 'crypto';

@Entity()
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informations de base
  @Column({ nullable: true })
  name?: string;

  // Caractéristiques physiques
  @Column('float', { nullable: true })
  size?: number;

  @Column('json', { nullable: true })
  coordinates?: {
    latitude: string;
    longitude: string;
  };

  @Column({ nullable: true })
  address?: string;

  @Column('float', { nullable: true })
  altitude?: number;

  @Column('float', { nullable: true })
  slope?: number;

  @Column({ nullable: true })
  exposition?: string;

  // Caractéristiques du sol
  @Column({ nullable: true })
  soilType?: string;

  @Column('float', { nullable: true })
  soilPH?: number;

  @Column({ nullable: true })
  soilQuality?: string;

  @Column({ nullable: true })
  drainage?: string;

  @Column('float', { nullable: true })
  organicMatter?: number;

  @Column({ nullable: true })
  lastSoilAnalysis?: string;

  // Informations sur la culture
  @Column({ nullable: true })
  cropType?: string;

  @Column({ nullable: true })
  cropVariety?: string;

  @Column({ nullable: true })
  plantingDate?: string;

  @Column({ nullable: true })
  expectedHarvestDate?: string;

  @Column('json', { nullable: true })
  rotationPlan?: string[];

  // Infrastructure et équipements
  @Column({ nullable: true })
  irrigationSystem?: string;

  @Column({ nullable: true })
  irrigationCapacity?: string;

  @Column({ nullable: true })
  waterSource?: string;

  @Column({ default: false })
  fencing?: boolean;

  @Column({ nullable: true })
  storage?: string;

  @Column({ nullable: true })
  accessibility?: string;

  // Données historiques
  @Column('json', { nullable: true })
  previousCrops?: string[];

  @Column('float', { nullable: true })
  averageYield?: number;

  @Column({ nullable: true })
  lastPlowing?: string;

  @Column({ nullable: true })
  lastFertilization?: string;

  // Prévisions et budget
  @Column('float', { nullable: true })
  expectedYield?: number;

  @Column('float', { nullable: true })
  productionCost?: number;

  @Column('float', { nullable: true })
  expectedRevenue?: number;

  // Contraintes et risques
  @Column('json', { nullable: true })
  climateRisks?: string[];

  @Column('json', { nullable: true })
  pestRisks?: string[];

  @Column('json', { nullable: true })
  diseaseHistory?: string[];

  // Informations légales
  @Column({ nullable: true })
  ownershipType?: string;

  @Column('json', { nullable: true })
  lease?: {
    startDate?: string;
    endDate?: string;
    cost?: string;
  };

  @Column('json', { nullable: true })
  certifications?: string[];

  // Métadonnées
  @CreateDateColumn()
  createdDate: Date;

  @Column({ default: 'planning' })
  status: string;

  @Column({ nullable: true })
  notes?: string;

  // Objectifs durabilité
  @Column('json', { nullable: true })
  sustainabilityGoals?: {
    waterReduction?: string;
    chemicalReduction?: string;
    carbonSequestration?: string;
    biodiversityIndex?: string;
  };

    @ManyToOne(() => Farmer, (farmer) => farmer.fields, { nullable: true, onDelete: 'SET NULL' })
  farmer?: Farmer;
}
