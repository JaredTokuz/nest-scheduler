import { MongoClient, Collection, MongoClientOptions } from "mongodb";
import { FactoryProvider } from "@nestjs/common";
import { ApiConfigService } from "../config.service";

export const CRONJOBS = "CRONJOBS";

export const cronJobProvider: FactoryProvider = {
  provide: CRONJOBS,
  useFactory: async (config: ApiConfigService): Promise<Collection> => {
    let opts: MongoClientOptions = {
      connectTimeoutMS: 2000,
      maxPoolSize: 2,
      minPoolSize: 1,
    }
    const client = await MongoClient.connect(`${config.mongoUri}`, opts);
    const connection = await client.connect().catch((e) => {
      console.error("provider error connecting to mongo", e);
      throw e;
    });

    return connection.db(config.dbName).collection("cronjobs");
  },
  inject: [ApiConfigService],
};
