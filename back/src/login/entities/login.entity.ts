// src/login/entities/login.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Entity()
export class Login {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  commune: string;

  @Column()
  village: string;

  @Column()
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Farmer, (farmer) => farmer.logins, { eager: true })
  farmer: Farmer;
}
