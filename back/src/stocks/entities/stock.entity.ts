import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Activities } from 'src/activities/entities/activity.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  subcategory: string;

  @Column({ type: 'float', nullable: true })
  quantity: number;

  @Column()
  unit: string;

  @Column()
  purchasePrice: string;

  @Column()
  supplier: string;

  @Column({ type: 'date' })
  purchaseDate: string;

  @Column({ type: 'date', nullable: true })
  expirationDate?: string;

  @Column()
  storageLocation: string;

  @Column()
  batchNumber: string;

  @Column({nullable: true })
  alertStock: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Activities, (activities) => activities.stock)
  activities: Activities[];

  @ManyToOne(() => Farmer, (farmer) => farmer.stocks, {
      nullable: true,
      onDelete: 'SET NULL',
    })
    farmer?: Farmer;
}
