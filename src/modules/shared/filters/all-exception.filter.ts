import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  ErrorResponseFactory,
  HttpAppException,
} from '@shared/factories/error-response.factory';
import { ApiResponseFactory } from '@shared/factories/api-response.factory';
import { IApiErrors } from '@shared/dtos/api-error.dto';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let responseBody = ErrorResponseFactory.internalServerError({
      message: 'Internal Server Error',
      error: exception,
    });

    if (exception instanceof HttpAppException) {
      responseBody = exception;
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse();
      let message: string | string[] = exception.message;

      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        message = response['message'] as string[] | string;
      }

      if (typeof response === 'string') {
        message = response;
      }

      responseBody = new HttpAppException(exception.getStatus(), {
        message: message,
        error: exception,
      });
    }

    const errorBody = ApiResponseFactory.error(
      responseBody.getResponse() as IApiErrors,
      {
        meta: {
          cause: responseBody?.cause || 'Not specified',
        },
      },
    );

    httpAdapter.reply(ctx.getResponse(), errorBody, responseBody.getStatus());
  }
}
