import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { CronModule } from "./cron/cron.module";

@Module({
  imports: [
    CronModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
