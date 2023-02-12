import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
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
    return this.cronService.deleteCron(id);
  }

  @Patch(":id")
  update(@Body() createCron: CreateCronDto) {
    return this.cronService.updateCron(createCron);
  }

  @Post("run/:id")
  runCronId(@Param("id") id: string) {
    return this.cronService.runJob(id);
  }
}
