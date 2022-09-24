import { Model } from 'mongoose';

import { UserRepository, WithId } from '../../base.repository';
import { DefaultMongoRepository } from '../mongo.repository';

import { User } from '@src/shared/infra/mongo/models/user.model';

export class MongoUserRepository extends DefaultMongoRepository<User> implements UserRepository {
  constructor(private userModel: Model<User> = User) {
    super(userModel);
  }

  public async findByEmail(email: string): Promise<WithId<User>> {
    return this.findOne({ email });
  }

  public async findById(id: string): Promise<WithId<User>> {
    return this.findOne({ _id: id });
  }
} 