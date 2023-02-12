import { CronJob } from "cron";
import { WithId } from "mongodb";
export interface CronTask {
    name: string;
    cron: string;
    url: string;
}
export type TaskDocument = WithId<CronTask>;
export interface ActiveCronTask extends TaskDocument {
    active: CronJob | undefined;
}
