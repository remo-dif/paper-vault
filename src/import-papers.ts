import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PapersImportService } from './papers/import/papers-import.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const importer = app.get(PapersImportService);
  const csvFilePath = process.argv[2] ?? 'papers.csv';

  try {
    await importer.runImport(csvFilePath);
  } finally {
    await app.close();
  }
}

void bootstrap();
