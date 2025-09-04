import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Entity()
export class Equipement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  subcategory: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({ nullable: true })
  supplier: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'date', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  condition: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Farmer, (farmer) => farmer.equipements, {
      nullable: true,
      onDelete: 'SET NULL',
    })
    farmer?: Farmer;
}
