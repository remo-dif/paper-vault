import { APP_STATUS_RESPONSE } from './app.constants';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  it('should return the API status', () => {
    expect(appService.getStatus()).toEqual(APP_STATUS_RESPONSE);
  });
});
