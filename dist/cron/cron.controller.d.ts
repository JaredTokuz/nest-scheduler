import { CronSchedulingService } from "./cron.service";
import { CreateCronDto } from "./dto/create-cron.dto";
export declare class CronController {
    private readonly cronService;
    constructor(cronService: CronSchedulingService);
    crons(): Promise<import("./interfaces/cron-task.interface").ActiveCronTask[]>;
    cron(id: string): Promise<import("./interfaces/cron-task.interface").TaskDocument | null>;
    create(createCron: CreateCronDto): Promise<"success" | undefined>;
    delete(id: string): Promise<"success" | undefined>;
    update(createCron: CreateCronDto): Promise<"success" | undefined>;
    runCronId(id: string): void;
}
