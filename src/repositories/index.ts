export type WithId<T> = { id: string } & T;

export interface BaseRepository<T> {
  create(data: T): Promise<WithId<T>>;
}