import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePaperDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsArray()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  authors: string[];

  @IsOptional()
  @IsString()
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
