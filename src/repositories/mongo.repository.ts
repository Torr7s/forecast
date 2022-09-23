import { Model } from 'mongoose';

import { WithId } from '.';
import { Repository } from './repository';

import { BaseModel } from '@src/shared/infra/mongo/models/base.model';

export abstract class MongoRepository<T extends BaseModel> extends Repository<T> {
  constructor(private model: Model<T>) {
    super();
  }
}