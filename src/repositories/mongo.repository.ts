import { Model } from 'mongoose';

import { WithId } from '.';
import { Repository } from './repository';

import { BaseModel } from '@src/shared/infra/mongo/models/base.model';

export abstract class MongoRepository<T extends BaseModel> extends Repository<T> {
  constructor(private model: Model<T>) {
    super();
  }

  public async create(data: T): Promise<WithId<T>> {
    const model = await new this.model(data).save();
    const modelJSON = model.toJSON<WithId<T>>() as WithId<T>;

    return modelJSON;
  } 
}