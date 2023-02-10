import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { object, string, InferType } from "yup";

const EnvironmentVariablesSchema = object({
  /** port for app to listen on */
  PORT: string().required(),
  /** mongo connection url */
  MONGO_URI: string().required(),
  /** database name for the app to use */
  DB_NAME: string().required(),
});

export type EnvironmentVariables = InferType<typeof EnvironmentVariablesSchema>;

@Injectable()
export class ApiConfigService {
  env: { PORT: string; MONGO_URI: string; DB_NAME: string };
  constructor(private configService: ConfigService) {
    const env: Partial<EnvironmentVariables> = {
      PORT: this.configService.get("PORT"),
      MONGO_URI: this.configService.get("MONGO_URI"),
      DB_NAME: this.configService.get("DB_NAME"),
    };
    this.env = EnvironmentVariablesSchema.validateSync(env);
  }

  get port(): string {
    return this.env.PORT;
  }

  get mongoUri(): string {
    return this.env.MONGO_URI;
  }

  get dbName(): string {
    return this.env.DB_NAME;
  }
}
