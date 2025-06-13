import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import { I18nContext, I18nValidationException } from 'nestjs-i18n';
import { BaseFilter } from '@shared/filters/base.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { IApiErrors } from '@shared/dtos/api-error.dto';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils';
import { ErrorResponseFactory } from '@shared/factories/error-response.factory';

@Catch(I18nValidationException)
export class I18nExceptionFilter extends BaseFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    super(I18nExceptionFilter.name);
  }

  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const i18n = I18nContext.current();
    const ctx = host.switchToHttp();
    let errors = exception.errors;
    const request = ctx.getRequest<Request>();
    this.logError(exception, request);

    if (i18n) {
      errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
        lang: i18n?.lang,
      });
    }

    const errorTransform = this.transformValidationErrors(errors);

    const errorBody = this.getResponse(
      errorTransform.getResponse() as IApiErrors,
      request,
      exception.cause,
    );

    httpAdapter.reply(ctx.getResponse(), errorBody, exception.getStatus());
  }

  private transformValidationErrors(errors: ValidationError[]) {
    const messages = errors.flatMap((error) => {
      if (error.constraints) {
        return Object.values(error.constraints);
      }
      return [];
    });

    return ErrorResponseFactory.badRequest({
      message: messages,
      error: 'Validation Failed',
    });
  }
}
