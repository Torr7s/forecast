import { GeoPosition } from '@src/shared/infra/mongo/models/beach.model';
import { User } from '@src/shared/infra/mongo/models/user.model';

import { WithId } from '@src/repositories/base.repository';
import { MongoBeachRepository } from '@src/repositories/mongo/beach/beach.repository';
import { MongoUserRepository } from '@src/repositories/mongo/user/user.repository';

import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';

describe('Beaches functional tests', (): void => {
  const defaultUser = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'youshallnotpass'
  }

  let user: WithId<User>;
  let token: string;
  
  beforeEach(async (): Promise<void> => {
    const mongoBeachRepo: MongoBeachRepository = new MongoBeachRepository();
    const mongoUserRepo: MongoUserRepository = new MongoUserRepository();

    await mongoBeachRepo.deleteAll();
    await mongoUserRepo.deleteAll();

    user = await mongoUserRepo.create(defaultUser);
    
    token = AuthProvider.signToken(user.id);
  });

  describe('When creating a beach', (): void => {
    it('should create a beach successfully', async (): Promise<void> => {
      const newBeach = {
        name: 'Manly',
        position: GeoPosition.E,
        lat: -33.792726,
        lng: 151.289824,
        user: user.id
      }

      const { body, status } = await global.testRequest
        .post('/api/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return validation error when a field is invalid', async (): Promise<void> => {
      const newBeach = {
        name: 'Manly',
        position: GeoPosition.E,
        lat: 'invalid_string',
        lng: 151.289824,
        user: user.id
      }

      const { body, status } = await global.testRequest
        .post('/api/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(status).toBe(400);
      expect(body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: 'request.body.lat should be number'
      });
    });
  });
});