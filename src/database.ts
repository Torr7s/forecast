import mongoose from 'mongoose';
import config, { IConfig } from 'config';

const dbConfig: IConfig = config.get('app.database');

export const connectDb = async (): Promise<void> => {
  await mongoose.connect(dbConfig.get('mongoUrl'));
}

export const closeDb = (): Promise<void> => mongoose.connection.close();