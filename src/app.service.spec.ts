import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  it('should return the API status', () => {
    expect(appService.getStatus()).toEqual({
      name: 'Paper Vault API',
      status: 'ok',
    });
  });
});
