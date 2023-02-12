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
exports.cronJobProvider = exports.CRONJOBS = void 0;
const mongodb_1 = require("mongodb");
const config_service_1 = require("../config.service");
exports.CRONJOBS = "CRONJOBS";
exports.cronJobProvider = {
    provide: exports.CRONJOBS,
    useFactory: (config) => __awaiter(void 0, void 0, void 0, function* () {
        let opts = {
            connectTimeoutMS: 2000,
            maxPoolSize: 2,
            minPoolSize: 1,
        };
        const client = yield mongodb_1.MongoClient.connect(`${config.mongoUri}`, opts);
        const connection = yield client.connect().catch((e) => {
            console.error("provider error connecting to mongo", e);
            throw e;
        });
        return connection.db(config.dbName).collection("cronjobs");
    }),
    inject: [config_service_1.ApiConfigService],
};
//# sourceMappingURL=database.provider.js.map