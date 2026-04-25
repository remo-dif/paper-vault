import { Expose } from 'class-transformer';

export class PaperResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  abstract?: string;

  @Expose()
  authors: string[];

  @Expose()
  venue?: string;

  @Expose()
  year?: number;

  @Expose()
  nCitation: number;

  @Expose()
  references: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class PaginatedPapersResponseDto {
  @Expose()
  data: PaperResponseDto[];

  @Expose()
  limit: number;

  @Expose()
  offset: number;

  @Expose()
  total: number;
}
