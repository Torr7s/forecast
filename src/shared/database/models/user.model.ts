import mongoose, { Document, Model } from 'mongoose';

import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED'
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export interface UserModel extends Omit<User, '_id'>, Document {}

const userSchema = new mongoose.Schema<UserModel>({
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
      ret.id = ret._id;

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

userSchema.pre<UserModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) return;

  try {
    const hashedPassword: string = await AuthProvider.hashPassword(this.password);

    this.password = hashedPassword;
  } catch (error) {
    console.error(
      `Error while trying to hash password for user ${this.name}.`
    )
  }
});

export const User: Model<UserModel> = mongoose.model<UserModel>('User', userSchema);