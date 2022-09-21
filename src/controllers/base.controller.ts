import mongoose from 'mongoose';
import { Response } from 'express';

import { CUSTOM_VALIDATION } from '@src/shared/infra/mongo/models/user.model';

import logger from '@src/logger';

import { ApiError, ApiErrorProps } from '@src/shared/utils/errors/api.error';

interface ErrorResponse {
  code: number;
  error: string;
}

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(response: Response, error: mongoose.Error.ValidationError | Error): Response {
    if (error instanceof mongoose.Error.ValidationError) {
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

  private handleClientErrors(error: mongoose.Error.ValidationError): ErrorResponse {
    const duplicatedKindErrors: (mongoose.Error.ValidatorError | mongoose.Error.CastError)[] = Object.values(error.errors).filter((err): boolean => err.kind === CUSTOM_VALIDATION.DUPLICATED);

    if (duplicatedKindErrors.length) {
      return {
        code: 409,
        error: error.message
      }
    }

    return {
      code: 422,
      error: error.message
    }
  }
}