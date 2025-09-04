import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LocationRegion } from './location-region.entity';


@Entity('location_countries')
export class LocationCountry extends BaseEntity {
@Index({ unique: true })
@Column({ length: 2 })
code: string; // ISO2 (ex: "FR")


@Index({ unique: true })
@Column({ length: 100 })
name: string;


@Column({ nullable: true, length: 8 })
emojiFlag?: string; // 🇫🇷


@OneToMany(() => LocationRegion, (r) => r.country, { cascade: false })
regions: LocationRegion[];
}