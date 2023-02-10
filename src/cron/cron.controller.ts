import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { WithId } from "mongodb";
import { CronSchedulingService } from "./cron.service";
import { CreateCronDto } from "./dto/create-cron.dto";

@Controller("cron")
export class CronController {
  constructor(private readonly cronService: CronSchedulingService) {}

  @Get()
  crons() {
    return this.cronService.getTasks();
  }

  @Get(":id")
  cron(@Param("id") id: string) {
    return this.cronService.getTaskById(id);
  }

  @Post("")
  create(@Body() createCron: CreateCronDto) {
    return this.cronService.createCron(createCron);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.cronService.deleteCron();
  }

  @Patch(":id")
  update(@Body() body: any) {}

  @Post("run")
  run(@Body() body: WithId<ScheduleEvent>) {
    return this.cronService.runJob(body);
  }

  @Post("run/:id")
  runCronId(@Param("id") id: string) {
    return this.cronService.runJob(id);
  }
}
