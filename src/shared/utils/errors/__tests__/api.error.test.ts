import { ApiError, ApiErrorResponse } from '../api.error';

describe('ApiError', (): void => {
  it('should format error with mandatory fields', (): void => {
    const error: ApiErrorResponse = ApiError.format({ code: 404, message: 'User not found!' });

    expect(error).toEqual({
      message: 'User not found!',
      error: 'Not Found',
      code: 404,
    });
  });

  it('should format error with mandatory fields and description', (): void => {
    const error: ApiErrorResponse = ApiError.format({
      code: 404,
      message: 'User not found!',
      description: 'This error happens when there is no user created',
    });

    expect(error).toEqual({
      message: 'User not found!',
      error: 'Not Found',
      code: 404,
      description: 'This error happens when there is no user created',
    });
  });

  it('should format error with mandatory fields and description and documentation', (): void => {
    const error: ApiErrorResponse = ApiError.format({
      code: 404,
      message: 'User not found!',
      description: 'This error happens when there is no user created',
      documentation: 'https://mydocs.com/error-404',
    });

    expect(error).toEqual({
      message: 'User not found!',
      error: 'Not Found',
      code: 404,
      description: 'This error happens when there is no user created',
      documentation: 'https://mydocs.com/error-404',
    });
  });
});