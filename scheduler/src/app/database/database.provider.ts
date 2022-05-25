import { EVENT_COLLECTION } from "../constants/injectables";
import { MongoClient, Collection } from "mongodb";
import { FactoryProvider } from "@nestjs/common";

export const databaseProviders: FactoryProvider = {
  provide: EVENT_COLLECTION,
  useFactory: async (): Promise<Collection> => {
    // console.log('Connecting to database...', environment.mongo_app_uri + '/?retryWrites=true&w=majority');
    const client = await MongoClient.connect("");
    const connection = await client.connect().catch((e) => {
      console.log("provider error connecting to mongo", e);
      throw e;
    });

    return connection.db("").collection("events");
  },
};

//aksldfhakljsdhfkl
