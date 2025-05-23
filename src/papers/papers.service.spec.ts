import { Test, TestingModule } from '@nestjs/testing';
import { PapersService } from './papers.service';

describe('PapersService', () => {
  let service: PapersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PapersService,
        {
          provide: 'PaperRepository',
          useValue: {
            find: jest.fn(), // Mock implementation
            findOne: jest.fn(), // Mock implementation
            create: jest.fn(), // Mock implementation
            save: jest.fn(), // Mock implementation
            update: jest.fn(), // Mock implementation
            delete: jest.fn(), // Mock implementation
          }, // Provide a mock implementation as needed
        },
      ],
    }).compile();

    service = module.get<PapersService>(PapersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
