import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaperDto } from './create-paper.dto';
import { Paper } from './paper.entity';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';
import { UpdatePaperDto } from './update-paper.dto';

describe('PapersController', () => {
  let controller: PapersController;
  let service: PapersService;

  const mockPaper: Paper = {
    id: '1',
    title: 'Test Paper',
    authors: ['Author'],
    abstract: 'abstract',
  } as Paper;

  const mockPapersService = {
    create: jest.fn().mockResolvedValue(mockPaper),
    findAll: jest.fn().mockResolvedValue([mockPaper]),
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
    it('should return an array of papers', async () => {
      await expect(controller.findAll()).resolves.toEqual([mockPaper]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single paper by id', async () => {
      await expect(controller.findOne('1')).resolves.toEqual(mockPaper);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update and return the paper', async () => {
      const dto: UpdatePaperDto = { title: 'Updated Title' };
      await expect(controller.update('1', dto)).resolves.toEqual({
        ...mockPaper,
        title: 'Updated Title',
      });
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return void', async () => {
      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
