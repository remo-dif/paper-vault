import { AppService } from "./app.service";

describe('AppService', () => {
  let appService: AppService;

  const mockPapersImportService = {
    runImport: jest.fn(),
  };

  beforeEach(() => {
    appService = new AppService(mockPapersImportService as any);
  });

  it('should return "Hello World!"', () => {
    expect(appService.getHello()).toBe('Hello World!');
  });

});
