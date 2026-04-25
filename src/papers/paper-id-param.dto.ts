import { IsUUID } from 'class-validator';
import { UUID_VERSION } from './papers.constants';

export class PaperIdParamDto {
  @IsUUID(UUID_VERSION)
  id: string;
}
