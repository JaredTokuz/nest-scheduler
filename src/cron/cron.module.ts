import { Module } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { CronSchedulingService } from "./cron.service";
import { CronController } from "./cron.controller";
import { ApiConfigService } from "./config.service";
import { cronJobProvider } from "./database/database.provider";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [CronController],
  providers: [ApiConfigService, cronJobProvider, CronSchedulingService],
})
export class CronModule {}
