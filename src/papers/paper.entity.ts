import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('papers')
export class Paper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  abstract: string;

  @Column('simple-array')
  authors: string[];

  @Column({ length: 255, nullable: true })
  venue?: string;

  @Column({ type: 'int', nullable: true })
  year?: number;

  @Column({ type: 'int', default: 0 })
  n_citation: number;

  @Column('simple-array', { nullable: true })
  references: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
