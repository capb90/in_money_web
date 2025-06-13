import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  ErrorResponseFactory,
  HttpAppException,
} from '@shared/factories/error-response.factory';
import { IApiErrors } from '@shared/dtos/api-error.dto';
import { Request } from 'express';
import { AppConfigService } from '../../../configs/app-config.service';
import { BaseFilter } from '@shared/filters/base.filter';

@Catch()
export class AllExceptionFilter extends BaseFilter implements ExceptionFilter {
  private get isProduction(): boolean {
    return this.configService.nodeEnv === 'production';
  }

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: AppConfigService,
  ) {
    super(AllExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    this.logError(exception, request);

    const errorTransform: HttpAppException = this.createErrorResponse(
      exception,
      this.isProduction,
    );

    const errorBody = this.getResponse(
      errorTransform.getResponse() as IApiErrors,
      request,
    );

    httpAdapter.reply(
      ctx.getResponse(),
      errorBody,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private createErrorResponse(exception: unknown, isProduction: boolean) {
    const message =
      exception instanceof Error && !isProduction
        ? exception.message
        : 'Internal Server Error';

    return ErrorResponseFactory.internalServerError({
      message,
      error: isProduction ? undefined : exception,
    });
  }
}
