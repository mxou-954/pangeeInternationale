// tutorial-video.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Generated,
  Index,
} from 'typeorm';

export enum Difficulty {
  DEBUTANT = 'debutant',
  INTERMEDIAIRE = 'intermediaire',
  AVANCE = 'avance',
}

@Entity('tutorial_videos')
@Index(['iid'], { unique: true })
export class TutorialVideo {
  // id technique UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // iid lisible (auto-incrément)
  @Column()
  @Generated('increment')
  iid: number;

  // date de création auto
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // --- Métadonnées vidéo ---
  @Column({ type: 'text' })
  iframe: string; // code <iframe> ou URL intégrée

  @Column({ type: 'int', unsigned: true })
  duree: number; // en secondes

  @Column({ length: 120 })
  formateur: string;

  @Column({ length: 32 })
  langue: string;

  @Column({ length: 180 })
  titre: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: Difficulty })
  difficulte: Difficulty;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[]; // stocké "tag1,tag2,tag3"

  // --- Stats ---
  @Column({ type: 'float', default: 0 })
  note: number; // 0..5

  @Column({ type: 'int', default: 0 })
  vues: number;

  @Column({ type: 'int', default: 0 })
  partage: number;
}
