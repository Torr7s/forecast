import logger from '@src/logger';

import { Response } from 'express';

import { ApiError, ApiErrorProps } from '@src/shared/utils/errors/api.error';

import { 
  DatabaseError, 
  DatabaseUnknownClientError, 
  DatabaseValidationError 
} from '@src/repositories/repository';

interface ErrorResponse {
  code: number;
  error: string;
}

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(response: Response, error: unknown): Response {
    if (
      error instanceof DatabaseValidationError ||
      error instanceof DatabaseUnknownClientError 
    ) {
      const { code, error: err }: ErrorResponse = this.handleClientErrors(error);

      return this.createErrorResponse(response, {
        code,
        message: err
      });
    }

    logger.error(error);

    return this.createErrorResponse(response, {
      code: 500,
      message: 'Something went wrong'
    });
  }

  protected createErrorResponse(response: Response, apiError: ApiErrorProps): Response {
    return response.status(apiError.code).send(ApiError.format(apiError));
  }

  private handleClientErrors(error: DatabaseError): ErrorResponse {
    if (error instanceof DatabaseValidationError) {
      return {
        code: 409,
        error: error.message
      }
    }

    return {
      code: 400,
      error: error.message
    }
  }
}