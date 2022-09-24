export class InternalError extends Error {
  public message: string;
  protected code: number;
  protected description?: string;

  constructor(message: string, code: number = 500, description?: string) {
    super(message);

    this.message = message;
    this.code = code;
    this.description = description;

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}