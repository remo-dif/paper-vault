import { NestFactory } from '@nestjs/core';
import {
  DEFAULT_IMPORT_FILE_PATH,
  IMPORT_FILE_PATH_ARG_INDEX,
} from './app.constants';
import { AppModule } from './app.module';
import { PapersImportService } from './papers/import/papers-import.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const importer = app.get(PapersImportService);
  const csvFilePath =
    process.argv[IMPORT_FILE_PATH_ARG_INDEX] ?? DEFAULT_IMPORT_FILE_PATH;

  try {
    await importer.runImport(csvFilePath);
  } finally {
    await app.close();
  }
}

void bootstrap();
