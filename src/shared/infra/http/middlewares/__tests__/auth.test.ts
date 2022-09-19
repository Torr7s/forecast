import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';
import { AuthMiddleware } from '../auth.middleware';

describe('AuthMiddleware', (): void => {
  it('should verify a JWT token and call the next middleware', async (): Promise<void> => {
    const jwtToken: string = AuthProvider.signToken({ data: 'fake' });
    
    const fakeRequest = {
      headers: {
        'x-access-token': jwtToken
      }
    }
    const fakeResponse = {};
    const fakeNext: jest.Mock = jest.fn();

    AuthMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeNext).toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED if an invalid token was given', async (): Promise<void> => {
    const fakeRequest = {
      headers: {
        'x-access-token': 'fake-token'
      }
    }

    const sendMock: jest.Mock = jest.fn();
    const fakeResponse = {
      status: jest.fn(() => ({
        send: sendMock
      }))
    }

    const fakeNext: jest.Mock = jest.fn();

    AuthMiddleware(fakeRequest, fakeResponse as object, fakeNext);

    expect(fakeResponse.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed'
    });
  });

  it('should return UNAUTHORIZED if no token is given', async (): Promise<void> => {
    const fakeRequest = {
      headers: {}
    }

    const sendMock: jest.Mock = jest.fn();
    const fakeResponse = {
      status: jest.fn(() => ({
        send: sendMock
      }))
    }

    const fakeNext: jest.Mock = jest.fn();

    AuthMiddleware(fakeRequest, fakeResponse as object, fakeNext);

    expect(fakeResponse.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided'
    });
  });
});