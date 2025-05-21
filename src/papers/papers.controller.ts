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
} from '@nestjs/common';
import { CreatePaperDto } from './create-paper.dto';
import { Paper } from './paper.entity';
import { PapersService } from './papers.service';
import { UpdatePaperDto } from './update-paper.dto';

@Controller('papers')
export class PapersController {
  
  constructor(private readonly papersService: PapersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPaperDto: CreatePaperDto): Promise<Paper> {
    return this.papersService.create(createPaperDto);
  }

  @Get()
  findAll(): Promise<Paper[]> {
    return this.papersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Paper> {
    return this.papersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaperDto: UpdatePaperDto,
  ): Promise<Paper> {
    return this.papersService.update(id, updatePaperDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.papersService.remove(id);
  }
}
