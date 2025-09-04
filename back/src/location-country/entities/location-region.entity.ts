import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LocationCountry } from './location-country.entity';
import { LocationCommune } from './location-commune.entity';


@Entity('location_regions')
@Index(['name', 'country'])
export class LocationRegion extends BaseEntity {
@Column({ length: 120 })
name: string;


@ManyToOne(() => LocationCountry, (c) => c.regions, { onDelete: 'CASCADE' })
country: LocationCountry;


@Column()
countryId: string;


@OneToMany(() => LocationCommune, (c) => c.region, { cascade: false })
communes: LocationCommune[];
}