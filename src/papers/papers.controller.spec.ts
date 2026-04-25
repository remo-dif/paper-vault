import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaperDto } from './create-paper.dto';
import { Paper } from './paper.entity';
import { PapersController } from './papers.controller';
import {
  DEFAULT_CITATION_COUNT,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
  PARSED_ROW_INCREMENT,
} from './papers.constants';
import { PapersService } from './papers.service';
import { UpdatePaperDto } from './update-paper.dto';

describe('PapersController', () => {
  let controller: PapersController;
  const mockId = '4ab3735c-80f1-472d-b953-fa0557fed28b';
  const mockPaperTimestamp = new Date();

  const mockPaper: Paper = {
    id: mockId,
    title: 'Test Paper',
    authors: ['Author'],
    abstract: 'abstract',
    nCitation: DEFAULT_CITATION_COUNT,
    references: [],
    createdAt: mockPaperTimestamp,
    updatedAt: mockPaperTimestamp,
  } as Paper;

  const mockPapersService: jest.Mocked<
    Pick<PapersService, 'create' | 'findAll' | 'findOne' | 'update' | 'remove'>
  > = {
    create: jest.fn().mockResolvedValue(mockPaper),
    findAll: jest.fn().mockResolvedValue({
      data: [mockPaper],
      limit: DEFAULT_PAGE_LIMIT,
      offset: DEFAULT_PAGE_OFFSET,
      total: PARSED_ROW_INCREMENT,
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
      expect(mockPapersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a paginated papers response', async () => {
      const query = {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_OFFSET,
      };

      await expect(controller.findAll(query)).resolves.toEqual({
        data: [mockPaper],
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_OFFSET,
        total: PARSED_ROW_INCREMENT,
      });
      expect(mockPapersService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single paper by id', async () => {
      await expect(controller.findOne({ id: mockId })).resolves.toEqual(
        mockPaper,
      );
      expect(mockPapersService.findOne).toHaveBeenCalledWith(mockId);
    });
  });

  describe('update', () => {
    it('should update and return the paper', async () => {
      const dto: UpdatePaperDto = { title: 'Updated Title' };
      await expect(controller.update({ id: mockId }, dto)).resolves.toEqual({
        ...mockPaper,
        title: 'Updated Title',
      });
      expect(mockPapersService.update).toHaveBeenCalledWith(mockId, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return void', async () => {
      await expect(controller.remove({ id: mockId })).resolves.toBeUndefined();
      expect(mockPapersService.remove).toHaveBeenCalledWith(mockId);
    });
  });
});
