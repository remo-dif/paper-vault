import { Transform, type TransformFnParams } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  ALLOWED_FUTURE_YEAR_OFFSET,
  AUTHORS_MAX_COUNT,
  CITATION_MIN_VALUE,
  REFERENCES_MAX_COUNT,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  UUID_VERSION,
  VENUE_MAX_LENGTH,
  YEAR_MIN_VALUE,
} from './papers.constants';

function trimString({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class CreatePaperDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(TITLE_MIN_LENGTH)
  @MaxLength(TITLE_MAX_LENGTH)
  @Transform(trimString)
  title: string;

  @IsOptional()
  @IsString()
  @Transform(trimString)
  abstract?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(AUTHORS_MAX_COUNT)
  @IsString({ each: true })
  authors: string[];

  @IsOptional()
  @IsString()
  @MaxLength(VENUE_MAX_LENGTH)
  @Transform(trimString)
  venue?: string;

  @IsOptional()
  @IsInt()
  @Min(YEAR_MIN_VALUE)
  @Max(new Date().getFullYear() + ALLOWED_FUTURE_YEAR_OFFSET)
  year?: number;

  @IsOptional()
  @IsInt()
  @Min(CITATION_MIN_VALUE)
  nCitation?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(REFERENCES_MAX_COUNT)
  @IsUUID(UUID_VERSION, { each: true })
  references?: string[];
}
