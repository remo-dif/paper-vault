import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreatePaperDto } from './create-paper.dto';
import { ListPapersDto, PaginatedPapersDto } from './list-papers.dto';
import { Paper } from './paper.entity';
import { UpdatePaperDto } from './update-paper.dto';

/**
 * Service providing CRUD operations and queries for Paper entities.
 *
 * @remarks
 * This service uses TypeORM's Repository to interact with the database.
 *
 * @method findAll Retrieves a paginated list of papers from the database.
 * @method findOne Retrieves a single paper by its ID. Throws NotFoundException if not found.
 * @method create Creates a new paper entity and saves it to the database.
 * @method update Updates an existing paper by its ID. Throws NotFoundException if not found.
 * @method remove Deletes a paper by its ID. Throws NotFoundException if not found.
 * @method findByTitle Finds all papers with the specified title.
 * @method findByAuthor Finds all papers authored by the specified author.
 */
@Injectable()
export class PapersService {
  constructor(
    @InjectRepository(Paper)
    private readonly paperRepository: Repository<Paper>,
  ) {}

  async findAll(query: ListPapersDto): Promise<PaginatedPapersDto<Paper>> {
    const limit = query.limit ?? 25;
    const offset = query.offset ?? 0;

    if (query.author) {
      const qb = this.paperRepository
        .createQueryBuilder('paper')
        .where(':author = ANY(paper.authors)', { author: query.author })
        .orderBy('paper.createdAt', 'DESC')
        .take(limit)
        .skip(offset);

      if (query.title) {
        qb.andWhere('paper.title ILIKE :title', { title: `%${query.title}%` });
      }

      const [data, total] = await qb.getManyAndCount();
      return { data, limit, offset, total };
    }

    const [data, total] = await this.paperRepository.findAndCount({
      where: query.title ? { title: ILike(`%${query.title}%`) } : {},
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { data, limit, offset, total };
  }

  async findOne(id: string): Promise<Paper> {
    const paper = await this.paperRepository.findOne({ where: { id } });
    if (!paper) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }
    return paper;
  }

  async create(paper: CreatePaperDto): Promise<Paper> {
    const newPaper = this.paperRepository.create(paper);
    return this.paperRepository.save(newPaper);
  }

  async update(id: string, updatePaperDto: UpdatePaperDto): Promise<Paper> {
    const result = await this.paperRepository.update(id, updatePaperDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paperRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }
  }

  async findByTitle(title: string): Promise<Paper[]> {
    return this.paperRepository.find({ where: { title } });
  }

  async findByAuthor(author: string): Promise<Paper[]> {
    return this.paperRepository
      .createQueryBuilder('paper')
      .where(':author = ANY(paper.authors)', { author })
      .getMany();
  }
}
