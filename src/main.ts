/* eslint-disable @typescript-eslint/no-floating-promises */
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './configs/app-config.service';
import { AllExceptionFilter } from '@shared/filters/all-exception.filter';
import { ValidationError } from 'class-validator';
import { ErrorResponseFactory } from '@shared/factories/error-response.factory';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);
  const port = configService.port;
  app.setGlobalPrefix(configService.apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
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
      },
    }),
  );
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter, configService));

  await app.listen(port ?? 3000);

  logger.log(
    `🚀 Application running on: http://localhost:${port}/${configService.apiPrefix}`,
  );
  logger.log(`📚 Environment: ${configService.nodeEnv}`);
}

bootstrap();
