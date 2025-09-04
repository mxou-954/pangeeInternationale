import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Field } from 'src/field/entities/field.entity';
import { Harvest } from 'src/harvests/entities/harvest.entity';

@Entity()
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  percentage?: string;

  @ManyToOne(() => Field, (field) => field.zones, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  field?: Field;

  @OneToMany(() => Harvest, (harvest) => harvest.zone)
  harvests?: Harvest[];

  @Column({ default: false })
  isArchived: boolean;
}
