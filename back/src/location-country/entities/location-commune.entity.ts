import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LocationRegion } from './location-region.entity';
import { LocationVillage } from './location-village.entity';


@Entity('location_communes')
@Index(['name', 'region'])
export class LocationCommune extends BaseEntity {
@Column({ length: 160 })
name: string;


@ManyToOne(() => LocationRegion, (r) => r.communes, { onDelete: 'CASCADE' })
region: LocationRegion;


@Column()
regionId: string;


@OneToMany(() => LocationVillage, (v) => v.commune, { cascade: false })
villages: LocationVillage[];
}