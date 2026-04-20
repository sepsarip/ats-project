export class HttpError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || null;
    if (Error.captureStackTrace)
      Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpError;
