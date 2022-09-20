import mongoose from 'mongoose';
import config, { IConfig } from 'config';

const mongoDbConfig: IConfig = config.get('app.database');

export const connect = async (): Promise<void> => {
  await mongoose.connect(mongoDbConfig.get('mongoUrl'));
}

export const close = async (): Promise<void> => await mongoose.connection.close();