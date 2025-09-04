import { Farmer } from 'src/farmer/entities/farmer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, 
  OneToMany
} from 'typeorm';
import { Activities } from 'src/activities/entities/activity.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informations personnelles
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column()
  gender: string;

  @Column()
  nationalId: string;

  // Coordonnées
  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column('json')
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };

  // Informations professionnelles
  @Column()
  position: string;

  @Column()
  department: string;

  @Column()
  employmentType: 'permanent' | 'saisonnier' | 'temporaire' | 'stage' | 'other';

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string;

  @Column()
  workSchedule: string;

  // Rémunération
  @Column()
  salaryType: 'horaire' | 'journalier' | 'mensuel' | 'tache' | 'other';

  @Column('float')
  salary: string;

  @Column()
  currency: string;

  @Column()
  paymentMethod: string;

  // Compétences et formation
  @Column('simple-array', { default: '' })
  skills: string[];

  @Column('simple-array', { default: '' })
  certifications: string[];

  @Column('text')
  experience: string;

  @Column('simple-array', { default: '' })
  languages: string[];

  // Statut et permissions
  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'on_leave';

  @Column('simple-array', { default: '' })
  permissions: string[];

  @Column({ default: 'worker' })
  accessLevel: 'worker' | 'supervisor' | 'manager';

  // Informations supplémentaires
  @Column({ nullable: true })
  photo: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('simple-array', { default: '' })
  documents: string[];

  // Audit
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Farmer, (farmer) => farmer.members, { nullable: true, onDelete: 'SET NULL' })
    farmer?: Farmer;

    @OneToMany(() => Activities, (activities) => activities.operator)
    activities: Activities[];
}
