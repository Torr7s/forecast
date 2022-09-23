import { Error, Model } from 'mongoose';

import { FilterOptions, WithId } from '.';
import {
  DatabaseInternalError,
  DatabaseUnknownClientError,
  DatabaseValidationError,
  Repository
} from './repository';

import { BaseModel } from '@src/shared/infra/mongo/models/base.model';
import { CUSTOM_VALIDATION } from '@src/shared/infra/mongo/models/user.model';

import logger from '@src/logger';

export abstract class DefaultMongoRepository<T extends BaseModel> extends Repository<T> {
  constructor(private model: Model<T>) {
    super();
  }

  public async create(data: T): Promise<WithId<T>> {
    try {
      const model = await new this.model(data).save();
      const modelJSON = model.toJSON<WithId<T>>() as WithId<T>;
  
      return modelJSON;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async find(options: FilterOptions) {
    try {
      const data = await this.model.find(options);
      const dataMapped: WithId<T>[] = data?.map((d) => d.toJSON<WithId<T>>() as WithId<T>);

      return dataMapped;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findOne(options: FilterOptions): Promise<WithId<T>> {
    try {
      const data = await this.model.findOne(options);
      const dataJSON = data?.toJSON<WithId<T>>() as WithId<T>;

      return dataJSON;
    } catch (error) {
      this.handleError(error);
    }
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error.ValidationError) {
      const duplicatedKindErrors: (Error.ValidatorError | Error.CastError)[] = Object.values(error.errors).filter(
        (err): boolean =>
          err.name === 'ValidatorError' &&
          err.kind === CUSTOM_VALIDATION.DUPLICATED
      );

      if (duplicatedKindErrors.length)
        throw new DatabaseValidationError(error.message);

      throw new DatabaseUnknownClientError(error.message);
    }

    logger.error(`Database error: ${error}`);

    throw new DatabaseInternalError('Something unexpected happend to the database');
  }
}