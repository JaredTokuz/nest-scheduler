import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Cron, SchedulerRegistry, CronExpression } from "@nestjs/schedule";
import { CronJob, CronJobParameters, time } from "cron";
import { AxiosRequestConfig } from "axios";
import { Collection, Filter, ObjectId, WithId } from "mongodb";
import { ActiveCronTask, CronTask, TaskDocument } from "./interfaces/cron-task.interface";
import { CRONJOBS } from "./database/database.provider";

@Injectable()
export class CronSchedulingService {
  private readonly logger = new Logger(CronSchedulingService.name);

  constructor(
    private httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(CRONJOBS)
    private tasksCollection: Collection<CronTask>
  ) {
    this.getTasks()
      .then((crontasks) => {
        this.logger.debug(`init events => Total: ${crontasks.length}`);
        crontasks.forEach((cron) => {
          this.schedulerRegistry.addCronJob(
            cron._id.toString(),
            new CronJob(cron.cron, cronRequestFactory(cron.url))
          );
        });
      })
      .finally(() => {
        this.logger.debug("init events created cron jobs complete");
      });
  }

  async getTasks(): Promise<ActiveCronTask[]> {
    const documents = await this.tasksCollection.find().toArray();
    const registered = this.schedulerRegistry.getCronJobs();
    const activeTasks = documents.map((doc) => {
      return {
        ...doc,
        active: registered.get(doc._id.toString()),
      }
    });
    return activeTasks;
  }

  async getTaskById(id: string): Promise<TaskDocument | null> {
    return this.tasksCollection.findOne({ _id: new ObjectId(id) });
  }

  async createCron(cron: CronTask) {
    try {
      const resp = await this.tasksCollection.insertOne(cron);
      this.schedulerRegistry.addCronJob(
        resp.insertedId.toString(),
        new CronJob(cron.cron, cronRequestFactory(cron.url))
      );
      this.logger.log(`cron ${cron.name} created`);
      return "success";
    } catch (err) {
      this.logger.error(`Failed to create cron: ${cron.name}`, err);
    }
  }

  /**
   * delete a cron job from the scheduler registry
   * @param event schedule event
   */
  async deleteCron(id: string) {
    try {
      this.schedulerRegistry.deleteCronJob(id);
      await this.tasksCollection.deleteOne({ _id: new ObjectId(id) });
      this.logger.log(`cron ${id} deleted`);
      return "success";
    } catch (err) {
      this.logger.error(`Failed to delete cron: ${id}`, err);
    }
  }

  /** updates individual event's schedule without restarting the server */
  async updateCron(cron: Partial<CronTask>) {
    try {
      const updatedCron = await this.tasksCollection.findOneAndUpdate({ name: cron.name }, { $set: cron})
      if (!updatedCron.value) {
        throw new Error(`Failed to update cron name did not match, ${cron.name}`);
      }
      this.schedulerRegistry.deleteCronJob(updatedCron.value._id.toString());
      this.schedulerRegistry.addCronJob(
        updatedCron.value._id.toString(),
        new CronJob(updatedCron.value.cron, cronRequestFactory(updatedCron.value.url))
      );
      this.logger.log("cron updated", cron.name);
      return "success";
    } catch (err) {
      this.logger.error(`Failed to update cron: ${cron.name}`, err);
    }
  }

  /**
   * manually fire of cron job
   * @param event pass either a schedule event or a cron job name; cron name can be
   * hard since it is mongo _id except for declarative jobs
   */
  runJob(event: any | string) {
    let job: CronJob;
    if (typeof event === "string") {
      job = this.schedulerRegistry.getCronJob(event);
    } else {
      job = this.schedulerRegistry.getCronJob(event._id.toString());
    }
    job.fireOnTick();
  }

}

const cronRequestFactory = (url: string) => {
  return () => {
    return;
  };
};
