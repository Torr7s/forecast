import { Model } from 'mongoose';

import { DefaultMongoRepository } from './mongo.repository';

import { Beach } from '@src/shared/infra/mongo/models/beach.model';

export class MongoBeachRepository extends DefaultMongoRepository<Beach> {
  constructor(private beachModel: Model<Beach> = Beach) {
    super(beachModel);
  }
}