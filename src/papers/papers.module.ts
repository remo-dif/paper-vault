import { Module } from '@nestjs/common';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paper } from './paper.entity';
import { PapersImportService } from './import/papers-import.service';

@Module({
  imports: [TypeOrmModule.forFeature([Paper])],
  controllers: [PapersController],
  providers: [PapersService, PapersImportService],
  exports: [PapersService, PapersImportService],
})
export class PapersModule {}