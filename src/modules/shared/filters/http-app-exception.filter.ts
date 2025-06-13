import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAppException } from '@shared/factories/error-response.factory';
import { BaseFilter } from '@shared/filters/base.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { IApiErrors } from '@shared/dtos/api-error.dto';

@Catch(HttpAppException)
export class HttpAppExceptionFilter
  extends BaseFilter
  implements ExceptionFilter
{
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    super(HttpAppExceptionFilter.name);
  }

  catch(exception: HttpAppException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    this.logError(exception, request);

    const errorBody = this.getResponse(
      exception.getResponse() as IApiErrors,
      request,
    );

    httpAdapter.reply(ctx.getResponse(), errorBody, exception.getStatus());
  }
}
