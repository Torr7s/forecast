import { AxiosError } from 'axios';

import { InternalError } from '../internal.error';

export class StormGlassResponseError extends InternalError {
  constructor(error: AxiosError) {
    const data: any = error.response.data;
    const status: number = error.response.status;

    const stringified: string = JSON.stringify(data);

    const internalErrorMessage: string = `Unexpected error returned by the StormGlass service: "Error: ${stringified} Code: ${status}"`;

    super(internalErrorMessage);
  }
}