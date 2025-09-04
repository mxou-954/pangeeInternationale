// activities.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Field } from 'src/field/entities/field.entity';
import { Harvest } from 'src/harvests/entities/harvest.entity';
import { Member } from 'src/members/entities/member.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Entity()
export class Activities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityType: string;

  @Column({ nullable: true })
  quantity: string;

  @Column({ default: 'L' })
  unit: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ default: 'completed' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Field, (field) => field.activities, { eager: true })
  field: Field;

  @ManyToOne(() => Harvest, (harvest) => harvest.activities, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  plantation: Harvest;

  @ManyToOne(() => Member, (member) => member.activities, { eager: true })
  operator: Member;

  @ManyToOne(() => Stock, (stock) => stock.activities, { eager: true })
  stock: Stock;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Farmer, (farmer) => farmer.activitiesFarm, {
      nullable: true,
      onDelete: 'SET NULL',
    })
    farmer?: Farmer;
}
