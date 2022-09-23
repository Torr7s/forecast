import { NextFunction, Request, Response } from 'express';

import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';

export function AuthMiddleware(request: Partial<Request>, response: Partial<Response>, next: NextFunction): void {
  const token = request.headers?.['x-access-token'] as string;

  try {
    const { sub } = AuthProvider.decodeToken(token);

    request.userId = sub;

    next();
  } catch (error) {
    if (error instanceof Error) {
      response
        .status?.(401)
        .send({
          code: 401,
          error: error.message
        });
    } else {
      response
        .status?.(401)
        .send({
          code: 401,
          error: 'Unknown auth error'
        });
    }
  }
}