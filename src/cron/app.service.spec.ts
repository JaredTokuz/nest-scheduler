import { HttpModule, HttpService } from "@nestjs/axios";
import { Test } from "@nestjs/testing";

import { CronSchedulingService } from "./cron.service";

describe("AppService", () => {
  let service: CronSchedulingService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [HttpService, CronSchedulingService],
      
    }).compile();

    service = app.get<CronSchedulingService>(CronSchedulingService);
    app
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("test public cron service methods", () => {
    it('should Create a cron', async () => {
      const createMessage = await service.createCron({
        name: "test",
        cron: "0 0 0 * * *",
        url: "http://localhost:3000",
      })
      expect(createMessage).toEqual("success");

      const tasks = await service.getTasks();
      expect(tasks.length).toEqual(1);
      expect(tasks[0].name).toEqual("test");
      expect(tasks[0].cron).toEqual("0 0 0 * * *");
      expect(tasks[0].url).toEqual("http://localhost:3000");
      expect(tasks[0].active).toBeTruthy();
    });

    it('should Create a cron', async () => {
      const createMessage = await service.createCron({
        name: "test",
        cron: "0 0 0 * * *",
        url: "http://localhost:3000",
      })
      expect(createMessage).toEqual("success");

      const tasks = await service.getTasks();
      expect(tasks.length).toEqual(1);
      expect(tasks[0].name).toEqual("test");
      expect(tasks[0].cron).toEqual("0 0 0 * * *");
      expect(tasks[0].url).toEqual("http://localhost:3000");
      expect(tasks[0].active).toBeTruthy();
    });

    let task_id: string;
    it('after creating, should be readable', async () => {
      const tasks = await service.getTasks();
      const task = await service.getTaskById(tasks[0]._id.toString());
      expect(task).toBeTruthy();
      task_id = task?._id.toString() || "";
    });

    it('after creating, it should be updateable', async () => {
      const createMessage = await service.updateCron({
        name: "testNewName",
        cron: "0/5 0 0 * * *",
      })
      expect(createMessage).toEqual("success");

      const tasks = await service.getTasks();
      expect(tasks.length).toEqual(1);
      expect(tasks[0].name).toEqual("testNewName");
      expect(tasks[0].cron).toEqual("0/5 0 0 * * *");
      expect(tasks[0].url).toEqual("http://localhost:3000");
      expect(tasks[0].active).toBeTruthy();
    });

    it('finally, it should be deleted', async () => {
      const deleteMessage = await service.deleteCron(task_id)
      expect(deleteMessage).toEqual("success");

      const tasks = await service.getTasks();
      expect(tasks.length).toEqual(0);
    });
  });
});
