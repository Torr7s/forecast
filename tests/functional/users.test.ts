import { User } from '@src/shared/database/models/user.model';

describe('Users functional tests', (): void => {
  beforeEach(async(): Promise<any> => await User.deleteMany({}));

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
  })
});