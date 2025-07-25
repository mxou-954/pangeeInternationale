import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { Activity } from 'src/activity/entities/activity.entity';

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

@OneToMany(() => Activity, (activity) => activity.farmer)
activities: Activity[];

}
