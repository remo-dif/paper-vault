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
import { Transform } from 'class-transformer';

export class CreatePaperDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  abstract?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  authors: string[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  venue?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  nCitation?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1000)
  @IsUUID('4', { each: true })
  references?: string[];
}
