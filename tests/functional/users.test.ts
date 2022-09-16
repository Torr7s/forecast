import { User } from '@src/shared/database/models/user.model';

describe('Users functional tests', (): void => {
  beforeEach(async (): Promise<any> => await User.deleteMany({}));

  describe('When creating a new user', (): void => {
    it('should create a user successfully', async (): Promise<void> => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'youshallnotpass',
      }

      const response = await global.testRequest.post('/api/users').send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });

    it('should return 422 when there is a validation error', async (): Promise<void> => {
      const newUser = {
        email: 'johndoe@gmail.com',
        password: 'youshallnotpass'
      }

      const response = await global.testRequest.post('/api/users').send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error:
          'User validation failed: name: Path `name` is required.'
      });
    });

    it('should return 409 when an email already exists', async (): Promise<void> => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'youshallnotpass',
      }

      await global.testRequest.post('/api/users').send(newUser);

      const response = await global.testRequest.post('/api/users').send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database.'
      });
    });
  })
});