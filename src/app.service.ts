import { Injectable } from '@nestjs/common';
import { PapersImportService } from './papers/import/papers-import.service';

@Injectable()
export class AppService {
  constructor(private readonly papersImportService: PapersImportService) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public async onModuleInit(): Promise<void> {
    return await this.papersImportService.runImport('papers.csv');
  }
}
