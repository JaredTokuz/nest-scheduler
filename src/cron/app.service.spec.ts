import { Test } from "@nestjs/testing";

import { AppService } from "./cron.service";

describe("AppService", () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe("getData", () => {
    it('should return "Welcome to scheduler!"', () => {
      expect(service.multiSync()).toEqual({ message: "Welcome to scheduler!" });
    });
  });
});
