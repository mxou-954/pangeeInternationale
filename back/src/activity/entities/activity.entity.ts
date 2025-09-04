import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { Farmer } from 'src/farmer/entities/farmer.entity'; 

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['message', 'document', 'profile_update', 'visit', 'comment', "commentDelete"],
  })
  type: 'message' | 'document' | 'profile_update' | 'visit' | 'comment' | "commentDelete";

  @Column()
  description: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true })
  author?: string;

  @ManyToOne(() => Farmer, (farmer) => farmer.activities, { eager: true })
  farmer: Farmer;
}
