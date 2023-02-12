"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var CronSchedulingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronSchedulingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const mongodb_1 = require("mongodb");
const database_provider_1 = require("./database/database.provider");
let CronSchedulingService = CronSchedulingService_1 = class CronSchedulingService {
    constructor(httpService, schedulerRegistry, tasksCollection) {
        this.httpService = httpService;
        this.schedulerRegistry = schedulerRegistry;
        this.tasksCollection = tasksCollection;
        this.logger = new common_1.Logger(CronSchedulingService_1.name);
        this.getTasks()
            .then((crontasks) => {
            this.logger.debug(`init events => Total: ${crontasks.length}`);
            crontasks.forEach((cron) => {
                this.schedulerRegistry.addCronJob(cron._id.toString(), new cron_1.CronJob(cron.cron, cronRequestFactory(cron.url)));
            });
        })
            .finally(() => {
            this.logger.debug("init events created cron jobs complete");
        });
    }
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.tasksCollection.find().toArray();
            const registered = this.schedulerRegistry.getCronJobs();
            const activeTasks = documents.map((doc) => {
                return Object.assign(Object.assign({}, doc), { active: registered.get(doc._id.toString()) });
            });
            return activeTasks;
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tasksCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    }
    createCron(cron) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield this.tasksCollection.insertOne(cron);
                this.schedulerRegistry.addCronJob(resp.insertedId.toString(), new cron_1.CronJob(cron.cron, cronRequestFactory(cron.url)));
                this.logger.log(`cron ${cron.name} created`);
                return "success";
            }
            catch (err) {
                this.logger.error(`Failed to create cron: ${cron.name}`, err);
            }
        });
    }
    deleteCron(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.schedulerRegistry.deleteCronJob(id);
                yield this.tasksCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                this.logger.log(`cron ${id} deleted`);
                return "success";
            }
            catch (err) {
                this.logger.error(`Failed to delete cron: ${id}`, err);
            }
        });
    }
    updateCron(cron) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCron = yield this.tasksCollection.findOneAndUpdate({ name: cron.name }, { $set: cron });
                if (!updatedCron.value) {
                    throw new Error(`Failed to update cron name did not match, ${cron.name}`);
                }
                this.schedulerRegistry.deleteCronJob(updatedCron.value._id.toString());
                this.schedulerRegistry.addCronJob(updatedCron.value._id.toString(), new cron_1.CronJob(updatedCron.value.cron, cronRequestFactory(updatedCron.value.url)));
                this.logger.log("cron updated", cron.name);
                return "success";
            }
            catch (err) {
                this.logger.error(`Failed to update cron: ${cron.name}`, err);
            }
        });
    }
    runJob(event) {
        let job;
        if (typeof event === "string") {
            job = this.schedulerRegistry.getCronJob(event);
        }
        else {
            job = this.schedulerRegistry.getCronJob(event._id.toString());
        }
        job.fireOnTick();
    }
};
CronSchedulingService = CronSchedulingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(database_provider_1.CRONJOBS)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        schedule_1.SchedulerRegistry,
        mongodb_1.Collection])
], CronSchedulingService);
exports.CronSchedulingService = CronSchedulingService;
const cronRequestFactory = (url) => {
    return () => {
        return;
    };
};
//# sourceMappingURL=cron.service.js.map