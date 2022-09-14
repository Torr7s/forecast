import { InternalError } from '../internal-error';

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    const internalErrorMessage: string = `Unexpected error during the forecast processing: "${message}"`;

    super(internalErrorMessage);
  }
}