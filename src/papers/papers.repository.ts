import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { ListPapersDto, PaginatedPapersDto } from './list-papers.dto';
import { Paper } from './paper.entity';
import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
  NO_AFFECTED_ROWS,
} from './papers.constants';

@Injectable()
export class PapersRepository {
  constructor(
    @InjectRepository(Paper)
    private readonly repository: Repository<Paper>,
  ) {}

  async findPage(query: ListPapersDto): Promise<PaginatedPapersDto<Paper>> {
    const limit = query.limit ?? DEFAULT_PAGE_LIMIT;
    const offset = query.offset ?? DEFAULT_PAGE_OFFSET;

    if (query.author) {
      const qb = this.repository
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

    const [data, total] = await this.repository.findAndCount({
      where: query.title ? { title: ILike(`%${query.title}%`) } : {},
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { data, limit, offset, total };
  }

  findById(id: string): Promise<Paper | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(paper: DeepPartial<Paper>): Promise<Paper> {
    return this.repository.save(this.repository.create(paper));
  }

  async update(id: string, paper: DeepPartial<Paper>): Promise<boolean> {
    const result = await this.repository.update(id, paper);
    return result.affected !== NO_AFFECTED_ROWS;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== NO_AFFECTED_ROWS;
  }

  findByTitle(title: string): Promise<Paper[]> {
    return this.repository.find({ where: { title } });
  }

  findByAuthor(author: string): Promise<Paper[]> {
    return this.repository
      .createQueryBuilder('paper')
      .where(':author = ANY(paper.authors)', { author })
      .getMany();
  }

  async upsertMany(papers: DeepPartial<Paper>[]): Promise<void> {
    await this.repository.upsert(papers, ['id']);
  }
}
