import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  recipientId: string;

  @Column()
  uploaderId: string;

  @Column({ type: 'timestamp' })
  uploadDate: Date;
}
