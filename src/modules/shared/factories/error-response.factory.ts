import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrorDto } from '@shared/dtos/api-error.dto';

export interface IOptionsErrors {
  message?: string | string[];
  error?: unknown;
}

export class ErrorResponseFactory {
  public static badRequest(options?: IOptionsErrors) {
    return new HttpAppException(HttpStatus.BAD_REQUEST, options);
  }
  public static unauthorized(options?: IOptionsErrors) {
    return new HttpAppException(HttpStatus.UNAUTHORIZED, options);
  }
  public static notFound(options?: IOptionsErrors) {
    return new HttpAppException(HttpStatus.NOT_FOUND, options);
  }
  public static forbidden(options?: IOptionsErrors) {
    return new HttpAppException(HttpStatus.FORBIDDEN, options);
  }
  public static notAcceptable(options?: IOptionsErrors) {
    return new HttpAppException(HttpStatus.NOT_ACCEPTABLE, options);
  }
  public static internalServerError(options?: IOptionsErrors) {
    return new HttpAppException(HttpStatus.INTERNAL_SERVER_ERROR, options);
  }
}

export class HttpAppException extends HttpException {
  constructor(statusCode: number, options?: IOptionsErrors) {
    super(
      new ApiErrorDto(
        options?.message || 'An unexpected error occurred.',
        statusCode,
      ),
      statusCode,
      {
        cause: options?.error,
      },
    );
  }
}
