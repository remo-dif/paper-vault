import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
  PAGE_LIMIT_MAX,
  PAGE_LIMIT_MIN,
  PAGE_OFFSET_MIN,
} from './papers.constants';

export class ListPapersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGE_LIMIT_MIN)
  @Max(PAGE_LIMIT_MAX)
  limit = DEFAULT_PAGE_LIMIT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGE_OFFSET_MIN)
  offset = DEFAULT_PAGE_OFFSET;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  title?: string;
}

export interface PaginatedPapersDto<T> {
  data: T[];
  limit: number;
  offset: number;
  total: number;
}
