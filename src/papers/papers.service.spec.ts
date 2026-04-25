import { Test, TestingModule } from '@nestjs/testing';
import { PapersService } from './papers.service';
import { PapersRepository } from './papers.repository';

describe('PapersService', () => {
  let service: PapersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PapersService,
        {
          provide: PapersRepository,
          useValue: {
            findPage: jest.fn(), // Mock implementation
            findById: jest.fn(), // Mock implementation
            create: jest.fn(), // Mock implementation
            update: jest.fn(), // Mock implementation
            delete: jest.fn(), // Mock implementation
            findByTitle: jest.fn(), // Mock implementation
            findByAuthor: jest.fn(), // Mock implementation
          },
        },
      ],
    }).compile();

    service = module.get<PapersService>(PapersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
