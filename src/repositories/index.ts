import { Beach } from '@src/shared/infra/mongo/models/beach.model';
import { User } from '@src/shared/infra/mongo/models/user.model';

export type WithId<T> = { id: string } & T;
export type FilterOptions = Record<string, unknown>;

export interface BaseRepository<T> {
  create(data: T): Promise<WithId<T>>;
  find(options: FilterOptions): Promise<WithId<T>[]>;
  findOne(options: FilterOptions): Promise<WithId<T> | undefined>;
}

export interface BeachRepository extends BaseRepository<Beach> {
  findAllBeachesForUser(userId: string): Promise<WithId<Beach>[]>;
}

export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<WithId<User> | undefined>;
  findById(id: string): Promise<WithId<User> | undefined>;
}