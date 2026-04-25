import { Test, TestingModule } from '@nestjs/testing';
import { PapersRepository } from '../papers.repository';
import { PapersImportService } from './papers-import.service';

describe('PapersImportService', () => {
  let service: PapersImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PapersImportService,
        {
          provide: PapersRepository,
          useValue: {
            upsertMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PapersImportService>(PapersImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
