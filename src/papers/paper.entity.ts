import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DEFAULT_CITATION_COUNT } from './papers.constants';

@Entity('papers')
export class Paper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  abstract?: string;

  @Column('text', { array: true, default: () => "'{}'" })
  authors: string[];

  @Column({ type: 'text', nullable: true })
  venue?: string;

  @Column({ type: 'int', nullable: true })
  year?: number;

  @Column({ name: 'n_citation', type: 'int', default: DEFAULT_CITATION_COUNT })
  nCitation: number;

  @Column('text', { array: true, default: () => "'{}'" })
  references: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
