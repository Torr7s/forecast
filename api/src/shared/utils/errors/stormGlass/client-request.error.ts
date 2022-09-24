import { InternalError } from '../internal.error';

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalErrorMessage: string = `Unexpected error when trying to communicate to StormGlass: "${message}"`;

    super(internalErrorMessage);
  }
}