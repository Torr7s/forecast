import httpStatusCodes from 'http-status-codes';

export interface ApiErrorProps {
  code: number;
  message: string;
  codeAsString?: string;
  description?: string;
  documentation?: string;
}

export interface ApiErrorResponse extends Omit<ApiErrorProps, 'codeAsString'> {
  error: string;
}

export class ApiError {
  public static format(error: ApiErrorProps): ApiErrorResponse {
    return {
      ...{
        code: error.code,
        message: error.message,
        error: error.codeAsString ? error.codeAsString : httpStatusCodes.getStatusText(error.code)
      },
      ...(
        error.documentation && {
          documentation: error.documentation
        }
      ),
      ...(
        error.description && {
          description: error.description
        }
      )
    }
  }
}