import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListPapersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 25;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

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
