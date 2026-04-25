import { Injectable } from '@nestjs/common';
import { APP_STATUS_RESPONSE } from './app.constants';

@Injectable()
export class AppService {
  public getStatus(): { name: string; status: string } {
    return APP_STATUS_RESPONSE;
  }
}
