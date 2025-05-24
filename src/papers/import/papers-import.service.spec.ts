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
            runImport: jest.fn(), // Mock the method if needed
          }, // Provide a mock implementation if needed
        },
      ],
    }).compile();

    service = module.get<PapersImportService>(PapersImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests here to cover the functionality of PapersImportService
});
