import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreatePaperDto } from './create-paper.dto';
import { ListPapersDto } from './list-papers.dto';
import { PaperIdParamDto } from './paper-id-param.dto';
import {
  PaginatedPapersResponseDto,
  PaperResponseDto,
} from './paper-response.dto';
import { PapersService } from './papers.service';
import { UpdatePaperDto } from './update-paper.dto';

@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPaperDto: CreatePaperDto): Promise<PaperResponseDto> {
    const paper = await this.papersService.create(createPaperDto);
    return this.toPaperResponse(paper);
  }

  @Get()
  async findAll(@Query() query: ListPapersDto): Promise<PaginatedPapersResponseDto> {
    const result = await this.papersService.findAll(query);

    return plainToInstance(
      PaginatedPapersResponseDto,
      {
        ...result,
        data: result.data.map((paper) => this.toPaperResponse(paper)),
      },
      { excludeExtraneousValues: true },
    );
  }

  @Get(':id')
  async findOne(@Param() params: PaperIdParamDto): Promise<PaperResponseDto> {
    const paper = await this.papersService.findOne(params.id);
    return this.toPaperResponse(paper);
  }

  @Put(':id')
  async update(
    @Param() params: PaperIdParamDto,
    @Body() updatePaperDto: UpdatePaperDto,
  ): Promise<PaperResponseDto> {
    const paper = await this.papersService.update(params.id, updatePaperDto);
    return this.toPaperResponse(paper);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: PaperIdParamDto): Promise<void> {
    return this.papersService.remove(params.id);
  }

  private toPaperResponse(paper: unknown): PaperResponseDto {
    return plainToInstance(PaperResponseDto, paper, {
      excludeExtraneousValues: true,
    });
  }
}
