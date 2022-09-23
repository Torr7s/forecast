import { Model } from 'mongoose';

import { BeachRepository, WithId } from '.';
import { DefaultMongoRepository } from './mongo.repository';

import { Beach } from '@src/shared/infra/mongo/models/beach.model';

export class MongoBeachRepository extends DefaultMongoRepository<Beach> implements BeachRepository {
  constructor(private beachModel: Model<Beach> = Beach) {
    super(beachModel);
  }

  public async findAllBeachesForUser(userId: string): Promise<WithId<Beach>[]> {
    return this.find({ userId });
  }
}