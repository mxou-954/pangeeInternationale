import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Field } from 'src/field/entities/field.entity';
import { Activities } from 'src/activities/entities/activity.entity';
import { Zone } from 'src/zones/entities/zone.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Entity()
export class Harvest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cropType: string;

  @Column({ type: 'date', nullable: true })
  plantingDate: Date;

  @Column({ type: 'date', nullable: true })
  harvestDate: Date;

  @Column({ type: 'text', nullable: true })
  variety: string;

  @ManyToOne(() => Zone, (zone) => zone.harvests, {
    nullable: true,
    onDelete: 'SET NULL', // 👈 si la zone est supprimée, on garde l'historique
  })
  zone?: Zone | null;

  @Column({ type: 'double precision', nullable: true })
  yieldTonnes: number | null;

  @Column({ type: 'text', nullable: true })
  pesticidesUsed: string;

  @Column({ type: 'text', nullable: true })
  problemsEncountered: string;

  @Column({ nullable: true })
  harvestQuality: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Field, (field) => field.harvest, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  field?: Field;

  @OneToMany(() => Activities, (activities) => activities.plantation)
  activities: Activities[];

  @Column({ default: false })
  isEnd: boolean;

  // ... et si tu veux tracer qui/quoi l’a clôturé
  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date;

  // --- SNAPSHOTS figées au moment de la clôture ---
  @Column({ nullable: true })
  zoneIdSnapshot?: string; // l'id de la zone au moment T

  @Column({ nullable: true })
  zoneNameSnapshot?: string; // ex: "Zone Nord - Maïs"

  @Column({ nullable: true })
  zonePercentageSnapshot?: string; // ex: "40"

  @Column({ nullable: true })
  fieldIdSnapshot?: string; // facultatif: pour savoir sur quel champ

  @ManyToOne(() => Farmer, (farmer) => farmer.harvests, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  farmer?: Farmer;
}
