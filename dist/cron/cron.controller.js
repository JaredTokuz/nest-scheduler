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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronController = void 0;
const common_1 = require("@nestjs/common");
const cron_service_1 = require("./cron.service");
const create_cron_dto_1 = require("./dto/create-cron.dto");
let CronController = class CronController {
    constructor(cronService) {
        this.cronService = cronService;
    }
    crons() {
        return this.cronService.getTasks();
    }
    cron(id) {
        return this.cronService.getTaskById(id);
    }
    create(createCron) {
        return this.cronService.createCron(createCron);
    }
    delete(id) {
        return this.cronService.deleteCron(id);
    }
    update(createCron) {
        return this.cronService.updateCron(createCron);
    }
    runCronId(id) {
        return this.cronService.runJob(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CronController.prototype, "crons", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CronController.prototype, "cron", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cron_dto_1.CreateCronDto]),
    __metadata("design:returntype", void 0)
], CronController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CronController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cron_dto_1.CreateCronDto]),
    __metadata("design:returntype", void 0)
], CronController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("run/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CronController.prototype, "runCronId", null);
CronController = __decorate([
    (0, common_1.Controller)("cron"),
    __metadata("design:paramtypes", [cron_service_1.CronSchedulingService])
], CronController);
exports.CronController = CronController;
//# sourceMappingURL=cron.controller.js.map