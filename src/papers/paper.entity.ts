import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('papers')
export class Paper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @Index()
  title: string;

  @Column('text')
  abstract: string;

  @Column({ length: 255 })
  authors: string;

  @Column({ type: 'date', nullable: true })
  publicationDate?: Date;

  @Column({ length: 255, nullable: true })
  journal?: string;

  @Column({ length: 100, nullable: true, unique: true })
  doi?: string;

  @Column({ length: 255, nullable: true })
  url?: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
