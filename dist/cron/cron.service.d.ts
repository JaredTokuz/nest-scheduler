import { HttpService } from "@nestjs/axios";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Collection } from "mongodb";
import { ActiveCronTask, CronTask, TaskDocument } from "./interfaces/cron-task.interface";
export declare class CronSchedulingService {
    private httpService;
    private schedulerRegistry;
    private tasksCollection;
    private readonly logger;
    constructor(httpService: HttpService, schedulerRegistry: SchedulerRegistry, tasksCollection: Collection<CronTask>);
    getTasks(): Promise<ActiveCronTask[]>;
    getTaskById(id: string): Promise<TaskDocument | null>;
    createCron(cron: CronTask): Promise<"success" | undefined>;
    deleteCron(id: string): Promise<"success" | undefined>;
    updateCron(cron: Partial<CronTask>): Promise<"success" | undefined>;
    runJob(event: any | string): void;
}
