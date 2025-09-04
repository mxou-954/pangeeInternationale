import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

// Entité illustrative (tu peux aussi la persister si tu veux suivre les connexions autorisées).
@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  // Ici on garde le champ pour compat, mais on ne l'utilise pas dans la vérification
  // (puisque tu imposes la vérif par listes séparées).
  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}