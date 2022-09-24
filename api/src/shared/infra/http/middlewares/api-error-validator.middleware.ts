import { NextFunction, Request, Response } from 'express';

import { ApiError } from '@src/shared/utils/errors/api.error';

export interface HTTPError extends Error {
  status?: number;
}

export function ApiErrorValidator(error: HTTPError, _: Partial<Request>, response: Response, __: NextFunction): void {
  const code: number = error.status || 500;

  response
    .status?.(code)
    .json(
      ApiError.format({
        code,
        message: error.message
      })
    );
}