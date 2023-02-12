"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_service_1 = require("./cron/config.service");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const globalPrefix = "api";
        app.setGlobalPrefix(globalPrefix);
        const apiConfigService = app.get(config_service_1.ApiConfigService);
        const port = apiConfigService.port;
        app.useGlobalPipes(new common_1.ValidationPipe());
        yield app.listen(port, () => {
            common_1.Logger.log("Listening at http://localhost:" + port + "/" + globalPrefix);
        });
    });
}
bootstrap();
//# sourceMappingURL=main.js.map