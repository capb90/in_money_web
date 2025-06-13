import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseFilter } from '@shared/filters/base.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { HttpAppException } from '@shared/factories/error-response.factory';
import { IApiErrors } from '@shared/dtos/api-error.dto';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    super(HttpExceptionFilter.name);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    let message: string | string[] = exception.message;
    const exceptionRepose = exception.getResponse();
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    this.logError(exception, request);

    if (typeof exceptionRepose === 'object' && exceptionRepose !== null) {
      if ('message' in exceptionRepose) {
        message = exceptionRepose['message'] as string[] | string;
      }
    } else {
      message = exceptionRepose;
    }

    const errorTransform = new HttpAppException(exception.getStatus(), {
      message: message,
      error: exception,
    });

    const errorBody = this.getResponse(
      errorTransform.getResponse() as IApiErrors,
      request,
    );

    httpAdapter.reply(ctx.getResponse(), errorBody, exception.getStatus());
  }
}
