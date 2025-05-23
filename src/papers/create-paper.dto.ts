export class CreatePaperDto {
  title: string;
  abstract: string;
  authors: string[];
  publicationDate?: Date;
  journal?: string;
  doi?: string;
  url?: string;
  isPublished?: boolean;
}
