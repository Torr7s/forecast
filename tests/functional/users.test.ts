import { User } from '@src/shared/infra/mongo/models/user.model';

import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';

describe('Users functional tests', (): void => {
  beforeEach(async (): Promise<any> => await User.deleteMany({}));

  describe('When creating a new user', (): void => {
    it('should create a new user with an encrypted password successfully', async (): Promise<void> => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'youshallnotpass',
      }

      const { body, status } = await global.testRequest.post('/api/users').send(newUser);

      expect(status).toBe(201);

      await expect(
        AuthProvider.comparePasswords(
          newUser.password,
          body.password
        )
      ).resolves.toBeTruthy();

      expect(body).toEqual(expect.objectContaining({
        ...newUser,
        ...{
          password: expect.any(String)
        }
      }));
    });

    it('should return 422 when there is a validation error', async (): Promise<void> => {
      const newUser = {
        email: 'johndoe@gmail.com',
        password: 'youshallnotpass'
      }

      const { body, status } = await global.testRequest.post('/api/users').send(newUser);

      expect(status).toBe(422);
      expect(body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message:
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

      const { body, status } = await global.testRequest.post('/api/users').send(newUser);

      expect(status).toBe(409);
      expect(body).toEqual({
        code: 409,
        error: 'Conflict',
        message: 'User validation failed: email: already exists in the database.'
      });
    });
  });

  describe('When authenticating a user', (): void => {
    it('should generate a token for a valid user', async (): Promise<void> => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'youshallnotpass',
      }

      await new User(newUser).save();

      const { body } = await global.testRequest.post('/api/users/auth').send({
        email: newUser.email,
        password: newUser.password
      });

      expect(body).toEqual(
        expect.objectContaining({
          token: expect.any(String)
        })
      );
    });

    it('should return UNAUTHORIZED if the given email was not found', async (): Promise<void> => {
      const { status } = await global.testRequest.post('/api/users/auth').send({
        email: 'fakeemail@yahoo.com',
        password: 'youshallnotpass'
      });

      expect(status).toBe(401)
    });

    it('should return UNAUTHORIZED if the password is invalid', async (): Promise<void> => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'youshallnotpass',
      }

      await new User(newUser).save();

      const { status } = await global.testRequest.post('/api/users/auth').send({
        email: newUser.password,
        password: '123'
      });

      expect(status).toBe(401);
    });
  });
});