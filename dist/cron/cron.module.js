"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const cron_service_1 = require("./cron.service");
const cron_controller_1 = require("./cron.controller");
const config_service_1 = require("./config.service");
const database_provider_1 = require("./database/database.provider");
let CronModule = class CronModule {
};
CronModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 3,
            }),
        ],
        controllers: [cron_controller_1.CronController],
        providers: [config_service_1.ApiConfigService, database_provider_1.cronJobProvider, cron_service_1.CronSchedulingService],
    })
], CronModule);
exports.CronModule = CronModule;
//# sourceMappingURL=cron.module.js.map