import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Farmer } from 'src/farmer/entities/farmer.entity';
import { Harvest } from 'src/harvests/entities/harvest.entity';
import { Activities } from 'src/activities/entities/activity.entity';
import { Zone } from 'src/zones/entities/zone.entity';

export interface PreviousCrop {
  harvestId: string;
  cropName?: string;        // blé, maïs, etc.
  varietyName?: string;     // si tu as l’info
  closedAt: string;         // ISO string
  zone?: {
    id?: string | null;
    name?: string | null;
    percentage?: number | null;
  };
}

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

  @Column({ nullable: true })
  plantingDate?: string;

  @Column({ nullable: true })
  expectedHarvestDate?: string;

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
  @Column('jsonb', { nullable: true })
  previousCrops?: PreviousCrop[];

  @Column({ nullable: true })
  lastPlowing?: string;

  @Column({ nullable: true })
  lastFertilization?: string;

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

  @ManyToOne(() => Farmer, (farmer) => farmer.fields, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  farmer?: Farmer;

  @OneToMany(() => Harvest, (harvest) => harvest.field)
  harvest: Harvest[];

  @OneToMany(() => Activities, (activities) => activities.field)
  activities: Activities[];

  @OneToMany(() => Zone, (zones) => zones.field)
  zones: Zone[];
}
