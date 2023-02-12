import { ConfigService } from "@nestjs/config";
import { InferType } from "yup";
declare const EnvironmentVariablesSchema: import("yup").ObjectSchema<{
    PORT: string;
    MONGO_URI: string;
    DB_NAME: string;
}, import("yup").AnyObject, {
    PORT: undefined;
    MONGO_URI: undefined;
    DB_NAME: undefined;
}, "">;
export type EnvironmentVariables = InferType<typeof EnvironmentVariablesSchema>;
export declare class ApiConfigService {
    private configService;
    env: {
        PORT: string;
        MONGO_URI: string;
        DB_NAME: string;
    };
    constructor(configService: ConfigService);
    get port(): string;
    get mongoUri(): string;
    get dbName(): string;
}
export {};
