import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';
import { Farmer } from 'src/farmer/entities/farmer.entity'; 

  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    text: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToOne(() => Farmer, (farmer) => farmer.comments, { eager: true })
    farmer: Farmer;
  
    @Column({ nullable: true })
    admin: string;
  }
  