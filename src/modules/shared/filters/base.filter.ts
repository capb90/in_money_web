import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { IApiErrors } from '@shared/dtos/api-error.dto';
import { ApiResponseFactory } from '@shared/factories/api-response.factory';

export class BaseFilter {
  private readonly className: string = BaseFilter.name;
  public logger: Logger;

  constructor(className: string) {
    this.className = className;
    this.logger = new Logger(className);
  }

  public logError(exception: unknown, request: Request): void {
    const message =
      exception instanceof Error ? exception.message : 'Unknown Error';
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(
      `${request.method} ${request.url}-${message}`,
      stack,
      this.className,
    );
  }

  public getStackTrace(exception: unknown): string | undefined {
    if (exception instanceof Error) {
      return exception.stack;
    }
    return undefined;
  }

  public getResponse(resBody: IApiErrors, request: Request, cause: unknown) {
    //todo: Add Observability
    this.logger.error('Cause', cause || 'Not specified', this.className);

    return ApiResponseFactory.error(resBody, {
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        /* cause: responseBody?.cause || 'Not specified',
        // Agregar más metadatos útiles si es necesario
        ...(this.isProduction() ? {} : { stack: this.getStackTrace(exception) }),*/
      },
    });
  }
}
