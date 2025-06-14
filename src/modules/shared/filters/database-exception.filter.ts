import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { BaseFilter } from './base.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { HttpAppException } from '@shared/factories/error-response.factory';
import { IApiErrors } from '@shared/dtos/api-error.dto';
import { I18nAppService } from '@app/configs';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter
  extends BaseFilter
  implements ExceptionFilter
{
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly i18n: I18nAppService,
  ) {
    super(DatabaseExceptionFilter.name);
  }

  async catch(exception: QueryFailedError, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    this.logError(exception, request);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = await this.i18n.translate('errors.internalServer');

    const errorCode: string = ((exception as any).code ||
      (exception as any).driverError?.code) as string;

    switch (errorCode) {
      case '23505':
        status = HttpStatus.CONFLICT;
        message = await this.i18n.translate('errors.resourceAlreadyExists');
        break;

      case '23502':
        status = HttpStatus.BAD_REQUEST;
        message = await this.i18n.translate('errors.requiredFieldsMissing');
        break;

      case '23503':
        status = HttpStatus.BAD_REQUEST;
        message = await this.i18n.translate('errors.invalidReference');
        break;

      case 'ECONNREFUSED':
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = await this.i18n.translate(
          'errors.serviceTemporarilyUnavailable',
        );
        break;
    }

    const errorTransform = new HttpAppException(status, {
      message: message,
      error: exception,
    });

    const errorBody = this.getResponse(
      errorTransform.getResponse() as IApiErrors,
      request,
      errorTransform.cause,
    );

    httpAdapter.reply(ctx.getResponse(), errorBody, status);
  }
}
