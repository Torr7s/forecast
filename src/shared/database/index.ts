import mongoose from 'mongoose';
import config, { IConfig } from 'config';

const dbConfig: IConfig = config.get('app.database');

let mongoUrl = dbConfig.get('mongoUrl') as string;

mongoUrl = mongoUrl.replace('.env-url', process.env.MONGODB_URL as string);

export const connect = async (): Promise<void> => {
  await mongoose.connect(mongoUrl);
}

export const close = async (): Promise<void> => await mongoose.connection.close();