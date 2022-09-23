import mongoose, { Document, Model, Schema } from 'mongoose';

import { BaseModel } from './base.model';

export enum GeoPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface Beach extends BaseModel {
  name: string;
  position: GeoPosition;
  lat: number;
  lng: number;
  user: string | Schema.Types.ObjectId;
}

export interface ExistingBeach extends Beach {
  id: string;
}

const beachSchema = new mongoose.Schema<Beach>({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: GeoPosition,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

// export interface BeachModel extends Beach, Document {}

export const Beach: Model<Beach> = mongoose.model<Beach>('Beach', beachSchema);