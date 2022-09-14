import mongoose, { connect as mongoConnect, connection } from 'mongoose';
import config, { IConfig } from 'config';

const dbConfig: IConfig = config.get('app.database');

let mongoUrl = dbConfig.get('mongoUrl') as string;

mongoUrl = mongoUrl.replace('.env-url', process.env.MONGODB_URL as string);

export const connect = async (): Promise<typeof mongoose> => await mongoConnect(mongoUrl);
export const close = async (): Promise<void> => await connection.close();