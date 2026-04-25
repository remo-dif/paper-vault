import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaperDto } from './create-paper.dto';
import { Paper } from './paper.entity';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';
import { UpdatePaperDto } from './update-paper.dto';

describe('PapersController', () => {
  let controller: PapersController;
  let service: PapersService;
  const mockId = '4ab3735c-80f1-472d-b953-fa0557fed28b';

  const mockPaper: Paper = {
    id: mockId,
    title: 'Test Paper',
    authors: ['Author'],
    abstract: 'abstract',
    nCitation: 0,
    references: [],
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  } as Paper;

  const mockPapersService = {
    create: jest.fn().mockResolvedValue(mockPaper),
    findAll: jest.fn().mockResolvedValue({
      data: [mockPaper],
      limit: 25,
      offset: 0,
      total: 1,
    }),
    findOne: jest.fn().mockResolvedValue(mockPaper),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockPaper, title: 'Updated Title' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PapersController],
      providers: [{ provide: PapersService, useValue: mockPapersService }],
    }).compile();

    controller = module.get<PapersController>(PapersController);
    service = module.get<PapersService>(PapersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return a paper', async () => {
      const dto: CreatePaperDto = {
        title: 'Test',
        authors: ['Author'],
        abstract: 'abstract',
      };
      await expect(controller.create(dto)).resolves.toEqual(mockPaper);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a paginated papers response', async () => {
      const query = { limit: 25, offset: 0 };

      await expect(controller.findAll(query)).resolves.toEqual({
        data: [mockPaper],
        limit: 25,
        offset: 0,
        total: 1,
      });
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single paper by id', async () => {
      await expect(controller.findOne({ id: mockId })).resolves.toEqual(mockPaper);
      expect(service.findOne).toHaveBeenCalledWith(mockId);
    });
  });

  describe('update', () => {
    it('should update and return the paper', async () => {
      const dto: UpdatePaperDto = { title: 'Updated Title' };
      await expect(controller.update({ id: mockId }, dto)).resolves.toEqual({
        ...mockPaper,
        title: 'Updated Title',
      });
      expect(service.update).toHaveBeenCalledWith(mockId, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return void', async () => {
      await expect(controller.remove({ id: mockId })).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(mockId);
    });
  });
});
