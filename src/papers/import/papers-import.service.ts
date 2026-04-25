import { Injectable, Logger } from '@nestjs/common';
import * as csv from 'csv-parser';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { Paper } from '../paper.entity';
import {
  DEFAULT_CITATION_COUNT,
  DEFAULT_IMPORT_BATCH_SIZE,
  EMPTY_BATCH_LENGTH,
  INITIAL_PARSED_ROW_COUNT,
  INTEGER_PARSE_RADIX,
  PARSED_ROW_INCREMENT,
} from '../papers.constants';
import { PapersRepository } from '../papers.repository';

@Injectable()
export class PapersImportService {
  private readonly logger = new Logger(PapersImportService.name);

  constructor(private readonly papersRepository: PapersRepository) {}

  async runImport(
    csvFilePath: string,
    batchSize = DEFAULT_IMPORT_BATCH_SIZE,
  ): Promise<void> {
    const fullPath = this.resolveImportPath(csvFilePath);
    const batch: Partial<Paper>[] = [];
    let parsedRows = INITIAL_PARSED_ROW_COUNT;

    for await (const row of createReadStream(fullPath).pipe(
      csv(),
    ) as AsyncIterable<Record<string, string>>) {
      try {
        batch.push(this.mapRowToPaper(row));
        parsedRows += PARSED_ROW_INCREMENT;

        if (batch.length >= batchSize) {
          await this.flushBatch(batch);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Failed to parse row: ${message}`);
      }
    }

    await this.flushBatch(batch);
    this.logger.log(`Import completed. Parsed ${parsedRows} papers.`);
  }

  private resolveImportPath(csvFilePath: string): string {
    const rootPath = resolve(process.cwd());
    const fullPath = resolve(rootPath, csvFilePath);

    if (!fullPath.startsWith(rootPath)) {
      throw new Error(`Import path must stay inside ${rootPath}`);
    }

    return fullPath;
  }

  private mapRowToPaper(row: Record<string, string>): Partial<Paper> {
    return {
      id: row.id,
      title: row.title,
      abstract: row.abstract,
      venue: row.venue,
      year: this.safeParseInt(row.year),
      nCitation:
        this.safeParseInt(row.n_citation, DEFAULT_CITATION_COUNT) ??
        DEFAULT_CITATION_COUNT,
      authors: this.parseJsonArray(row.authors),
      references: this.parseJsonArray(row.references),
    };
  }

  private async flushBatch(batch: Partial<Paper>[]): Promise<void> {
    if (batch.length === EMPTY_BATCH_LENGTH) {
      return;
    }

    await this.papersRepository.upsertMany(batch);
    batch.length = EMPTY_BATCH_LENGTH;
  }

  private parseJsonArray(raw: string): string[] {
    if (!raw || raw.trim() === '') return [];
    try {
      // Try to parse as JSON array first
      const parsed: unknown = JSON.parse(raw);
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

  private safeParseInt(
    value: unknown,
    defaultValue?: number,
  ): number | undefined {
    const parsed = parseInt(String(value), INTEGER_PARSE_RADIX);
    if (isNaN(parsed)) return defaultValue;
    return parsed;
  }
}
