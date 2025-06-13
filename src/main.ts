/* eslint-disable @typescript-eslint/no-floating-promises */
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationError } from '@nestjs/common';
import { AppConfigService } from './configs/app-config.service';
import { AllExceptionFilter } from '@shared/filters/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ErrorResponseFactory } from '@shared/factories/error-response.factory';
import { HttpAppExceptionFilter } from '@shared/filters/http-app-exception.filter';
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter';

function setupGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}

function setupGlobalFilters(
  app: INestApplication,
  configService: AppConfigService,
) {
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionFilter(httpAdapter, configService),
    new HttpExceptionFilter(httpAdapter),
    new HttpAppExceptionFilter(httpAdapter),
    new I18nValidationExceptionFilter({
      errorFormatter(errors: ValidationError[]) {
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
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API In-money')
    .setDescription('Documentación de la API con Swagger')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

function logApplicationStart(
  logger: Logger,
  port: number,
  configService: AppConfigService,
) {
  logger.log(
    `🚀 Application running on: http://localhost:${port}/${configService.apiPrefix}`,
  );
  logger.log(`📚 Environment: ${configService.nodeEnv}`);
  logger.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(AppConfigService);
    const port = configService.port ?? 3000;

    app.setGlobalPrefix(configService.apiPrefix);

    setupGlobalPipes(app);
    setupGlobalFilters(app, configService);
    setupSwagger(app);

    await app.listen(port);

    logApplicationStart(logger, port, configService);
  } catch (error) {
    logger.error('Error starting application:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  const logger = new Logger('UnhandledRejection');
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  const logger = new Logger('UncaughtException');
  logger.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

bootstrap();
