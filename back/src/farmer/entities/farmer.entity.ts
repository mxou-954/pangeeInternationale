import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Login } from 'src/login/entities/login.entity';
import { Field } from 'src/field/entities/field.entity';
import { Member } from 'src/members/entities/member.entity';
import { Guide } from 'src/guide/entities/guide.entity';
import { Harvest } from 'src/harvests/entities/harvest.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import { Equipement } from 'src/equipements/entities/equipement.entity';
import { Activities } from 'src/activities/entities/activity.entity';
import { LocationVillage } from 'src/location-country/entities/location-village.entity';

@Entity()
export class Farmer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  commune: string;

  @Column()
  village: string;

  @Column({nullable: true})
  countryName: string;

  @Column({nullable: true})
  regionName: string;

  @Column({nullable: true})
  communeName: string;

  @Column({nullable: true})
  villageName: string;

  @Column()
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isFavorite: boolean;

  @Column()
  status: string; // Utilisation de WebSocket

  @OneToMany(() => Comment, (comment) => comment.farmer)
  comments: Comment[];

  @OneToMany(() => Harvest, (harvest) => harvest.farmer)
  harvests: Harvest[];

  @OneToMany(() => Activity, (activity) => activity.farmer)
  activities: Activity[];

  @OneToMany(() => Login, (login) => login.farmer)
  logins: Login[];

  @OneToMany(() => Field, (field) => field.farmer)
  fields: Field[];

  @OneToMany(() => Member, (member) => member.farmer)
  members: Member[];

  @OneToMany(() => Guide, (guide) => guide.farmer)
  guides: Guide[];

  @OneToMany(() => Stock, (stock) => stock.farmer)
  stocks: Stock[];

  @OneToMany(() => Equipement, (equipement) => equipement.farmer)
  equipements: Equipement[];

  @OneToMany(() => Activities, (activitie) => activitie.farmer)
  activitiesFarm: Activities[];

  @ManyToOne(() => LocationVillage, (v) => v.farmers, {
    eager: true, 
    nullable: true,
  })
  villageRel: LocationVillage;
}
