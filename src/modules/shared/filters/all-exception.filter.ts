import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import {
  ErrorResponseFactory,
  HttpAppException,
} from '@shared/factories/error-response.factory';
import { ApiResponseFactory } from '@shared/factories/api-response.factory';
import { IApiErrors } from '@shared/dtos/api-error.dto';
import { Request } from 'express';
import { AppConfigService } from '../../../configs/app-config.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  private get isProduction(): boolean {
    return this.configService.nodeEnv === 'production';
  }

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: AppConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    this.logError(exception, request);

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: HttpAppException;

    if (exception instanceof HttpAppException) {
      responseBody = exception;
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionRepose = exception.getResponse();
      let message: string | string[] = exception.message;

      if (typeof exceptionRepose === 'object' && exceptionRepose !== null) {
        if ('message' in exceptionRepose) {
          message = exceptionRepose['message'] as string[] | string;
        }
      } else {
        message = exceptionRepose;
      }

      responseBody = new HttpAppException(httpStatus, {
        message: message,
        error: exception,
      });
    } else if (exception instanceof Error) {
      responseBody = ErrorResponseFactory.internalServerError({
        message: this.isProduction
          ? 'Internal Server Error'
          : exception.message,
        error: this.isProduction ? undefined : exception,
      });
    } else {
      responseBody = ErrorResponseFactory.internalServerError({
        message: 'Internal Server Error',
        error: this.isProduction ? undefined : exception,
      });
    }

    const errorBody = ApiResponseFactory.error(
      responseBody.getResponse() as IApiErrors,
      {
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          cause: responseBody?.cause || 'Not specified',
          ...(this.isProduction
            ? {}
            : { stack: this.getStackTrace(exception) }),
        },
      },
    );

    httpAdapter.reply(ctx.getResponse(), errorBody, responseBody.getStatus());
  }

  private logError(exception: unknown, request: Request): void {
    const message =
      exception instanceof Error ? exception.message : 'Unknown Error';
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(
      `${request.method} ${request.url}-${message}`,
      stack,
      AllExceptionFilter.name,
    );
  }

  private getStackTrace(exception: unknown): string | undefined {
    if (exception instanceof Error) {
      return exception.stack;
    }
    return undefined;
  }
}
