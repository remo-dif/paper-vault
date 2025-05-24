import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Paper } from '../paper.entity';

@Injectable()
export class PapersImportService {
  private readonly logger = new Logger(PapersImportService.name);

  constructor(
    @InjectRepository(Paper)
    private readonly paperRepository: Repository<Paper>,
  ) {}

  async runImport(csvFilePath: string): Promise<void> {
    const fullPath = join(process.cwd(), csvFilePath);
    const papers: Partial<Paper>[] = [];

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(fullPath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            papers.push({
              id: row.id,
              title: row.title,
              abstract: row.abstract,
              venue: row.venue,
              year: this.safeParseInt(row.year),
              n_citation: this.safeParseInt(row.n_citation, 0),
              authors: this.parseJsonArray(row.authors),
              references: this.parseJsonArray(row.references),
            });
          } catch (error: any) {
            this.logger.error(`Failed to parse row: ${error.message}`);
          }
        })
        .on('end', async () => {
          this.logger.log(`Parsed ${papers.length} papers. Saving to DB...`);
          try {
            for (const paper of papers) {
              const exists = await this.paperRepository.findOneBy({ id: paper.id });
              if (!exists) {
                await this.paperRepository.save(paper);
              }
            }
            this.logger.log('Import completed.');
            resolve();
          } catch (err: any) {
            this.logger.error(`Error saving papers: ${err.message}`);
            reject(err);
          }
        })
        .on('error', (err) => {
          this.logger.error(`Stream error: ${err.message}`);
          reject(err);
        });
    });
  }

  private parseJsonArray(raw: string): string[] {
    if (!raw || raw.trim() === '') return [];
    try {
      // Try to parse as JSON array first
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Fallback: try to split manually
      const cleaned = raw.replace(/^\s*\[|\]\s*$/g, '');
      return cleaned
        .split(',')
        .map((item) => item.replace(/['"]/g, '').trim())
        .filter(Boolean);
    }
    return [];
  }

  private safeParseInt(value: any, defaultValue: number | undefined = undefined): number | undefined {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) return defaultValue;
    return parsed;
  }
}
