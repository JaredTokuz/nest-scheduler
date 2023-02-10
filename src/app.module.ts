import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { CronSchedulingService } from "./cron/cron.service";
import { CronController } from "./cron/cron.controller";
import { ApiConfigService } from "./cron/config.service";
import { databaseProviders } from "./cron/database/database.provider";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [CronController],
  providers: [CronSchedulingService, ApiConfigService, databaseProviders],
})
export class AppModule {}
