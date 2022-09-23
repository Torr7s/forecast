import { Model } from 'mongoose';

import { MongoRepository } from './mongo.repository';

import { Beach } from '@src/shared/infra/mongo/models/beach.model';

export class MongoBeachRepository extends MongoRepository<Beach> {
  constructor(private beachModel: Model<Beach> = Beach) {
    super(beachModel);
  }
}