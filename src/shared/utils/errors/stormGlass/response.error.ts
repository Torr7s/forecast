import { InternalError } from '../internal-error';

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalErrorMessage: string = `Unexpected error returned by the StormGlass service: ${message}`;

    super(internalErrorMessage);
  }
}