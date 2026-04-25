import { IsUUID } from 'class-validator';

export class PaperIdParamDto {
  @IsUUID('4')
  id: string;
}
