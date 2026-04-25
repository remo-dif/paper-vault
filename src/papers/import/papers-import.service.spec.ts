import { Test, TestingModule } from '@nestjs/testing';
import { PapersImportService } from './papers-import.service';

describe('PapersImportService', () => {
  let service: PapersImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PapersImportService,
        {
          provide: 'PaperRepository',
          useValue: {
            upsert: jest.fn(),
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
