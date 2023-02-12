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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const yup_1 = require("yup");
const EnvironmentVariablesSchema = (0, yup_1.object)({
    PORT: (0, yup_1.string)().required(),
    MONGO_URI: (0, yup_1.string)().required(),
    DB_NAME: (0, yup_1.string)().required(),
});
let ApiConfigService = class ApiConfigService {
    constructor(configService) {
        this.configService = configService;
        const env = {
            PORT: this.configService.get("PORT"),
            MONGO_URI: this.configService.get("MONGO_URI"),
            DB_NAME: this.configService.get("DB_NAME"),
        };
        this.env = EnvironmentVariablesSchema.validateSync(env);
    }
    get port() {
        return this.env.PORT;
    }
    get mongoUri() {
        return this.env.MONGO_URI;
    }
    get dbName() {
        return this.env.DB_NAME;
    }
};
ApiConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ApiConfigService);
exports.ApiConfigService = ApiConfigService;
//# sourceMappingURL=config.service.js.map