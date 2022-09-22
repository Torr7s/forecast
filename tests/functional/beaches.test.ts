import { Beach, GeoPosition } from '@src/shared/infra/mongo/models/beach.model';
import { User, UserModel } from '@src/shared/infra/mongo/models/user.model';

import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';

describe('Beaches functional tests', (): void => {
  const defaultUser = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'youshallnotpass'
  }

  let user: UserModel;
  let token: string;

  beforeEach(async (): Promise<void> => {
    await Beach.deleteMany();
    await User.deleteMany();

    user = await new User(defaultUser).save();

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

      const response = await global.testRequest
        .post('/api/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return validation error when a field is invalid', async (): Promise<void> => {
      const newBeach = {
        name: 'Manly',
        position: GeoPosition.E,
        lat: 'invalid_string',
        lng: 151.289824,
        user: user.id
      }

      const response = await global.testRequest
        .post('/api/beaches')
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: 'request.body.lat should be number'
      });
    });
  });

  afterAll(async (): Promise<void> => {
    await Beach.deleteMany();
    await User.deleteMany();
  });
});