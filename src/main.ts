/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './configs/app-config.service';

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
    }),
  );

  await app.listen(port ?? 3000);

  logger.log(
    `🚀 Application running on: http://localhost:${port}/${configService.apiPrefix}`,
  );
  logger.log(`📚 Environment: ${configService.nodeEnv}`);
}

bootstrap();
