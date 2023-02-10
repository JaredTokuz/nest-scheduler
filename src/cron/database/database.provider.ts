import { MongoClient, Collection } from "mongodb";
import { FactoryProvider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export const TASKS_COLLECTION = "TASKS_COLLECTION";

export const databaseProviders: FactoryProvider = {
  provide: TASKS_COLLECTION,
  useFactory: async (configService: ConfigService): Promise<Collection> => {
    configService.get("MONGO_URI");
    const client = await MongoClient.connect("");
    const connection = await client.connect().catch((e) => {
      console.log("provider error connecting to mongo", e);
      throw e;
    });

    return connection.db("").collection("events");
  },
};
