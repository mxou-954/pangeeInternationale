import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LocationCommune } from './location-commune.entity';
import { Farmer } from 'src/farmer/entities/farmer.entity';

@Entity('location_villages')
@Index(['name', 'commune'])
export class LocationVillage extends BaseEntity {
  @Column({ length: 160 })
  name: string;

  @ManyToOne(() => LocationCommune, (c) => c.villages, { onDelete: 'CASCADE' })
  commune: LocationCommune;

  @Column()
  communeId: string;

  @OneToMany(() => Farmer, (f) => f.villageRel, {nullable : true})
  farmers: Farmer[];
}
