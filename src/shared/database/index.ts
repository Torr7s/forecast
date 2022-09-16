import mongoose from 'mongoose';

export const connect = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URL as string);
}

export const close = async (): Promise<void> => await mongoose.connection.close();