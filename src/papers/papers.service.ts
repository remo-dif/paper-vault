import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaperDto } from './create-paper.dto';
import { ListPapersDto, PaginatedPapersDto } from './list-papers.dto';
import { Paper } from './paper.entity';
import { PapersRepository } from './papers.repository';
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
  constructor(private readonly papersRepository: PapersRepository) {}

  async findAll(query: ListPapersDto): Promise<PaginatedPapersDto<Paper>> {
    return this.papersRepository.findPage(query);
  }

  async findOne(id: string): Promise<Paper> {
    const paper = await this.papersRepository.findById(id);
    if (!paper) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }
    return paper;
  }

  async create(paper: CreatePaperDto): Promise<Paper> {
    return this.papersRepository.create(paper);
  }

  async update(id: string, updatePaperDto: UpdatePaperDto): Promise<Paper> {
    const updated = await this.papersRepository.update(id, updatePaperDto);
    if (!updated) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.papersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }
  }

  async findByTitle(title: string): Promise<Paper[]> {
    return this.papersRepository.findByTitle(title);
  }

  async findByAuthor(author: string): Promise<Paper[]> {
    return this.papersRepository.findByAuthor(author);
  }
}
