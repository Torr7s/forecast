import mongoose, { Document, Model } from 'mongoose';

import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';

import logger from '@src/logger';

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED'
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface ExistingUser extends User {
  id: string;
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform: (_, ret): void => {
      ret.id = ret._id.toString();

      delete ret._id;
      delete ret.__v;
    }
  }
});

userSchema.path('email').validate(async (email: string): Promise<boolean> => {
  const emailCount: number = await mongoose.models.User.countDocuments({ email });

  return !emailCount;
},
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

userSchema.pre<User & Document>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) return;

  try {
    const hashedPassword: string = await AuthProvider.hashPassword(this.password);

    this.password = hashedPassword;
  } catch (error) {
    logger.error(`Error while trying to hash password for user ${this.name}.`, error);
  }
});

export const User: Model<User> = mongoose.model<User>('User', userSchema);