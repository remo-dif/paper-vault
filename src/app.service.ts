import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getStatus(): { name: string; status: string } {
    return {
      name: 'Paper Vault API',
      status: 'ok',
    };
  }
}
