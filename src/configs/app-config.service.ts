import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv() {
    return this.configService.get<string>('NODE_ENV') as string;
  }

  get port() {
    return this.configService.get<number>('PORT') as number;
  }

  get apiPrefix() {
    return this.configService.get<string>('API_PREFIX') as string;
  }

  get dataBase() {
    return {
      DB_URL: this.configService.get<string>('DATABASE_URL') as string,
      DB_USER: this.configService.get<string>('DATABASE_USER') as string,
      DB_NAME: this.configService.get<string>('DATABASE_DB') as string,
      DB_PORT: this.configService.get<number>('DATABASE_PORT') as number,
      DB_HOST: this.configService.get<string>('DATABASE_HOST') as string,
      DB_PASSWORD: this.configService.get<string>(
        'DATABASE_PASSWORD',
      ) as string,
    };
  }

  get mailService() {
    return {
      SERVICE: this.configService.get<string>('MAILER_SERVICE') as string,
      EMAIL: this.configService.get<string>('MAILER_EMAIL') as string,
      SECRET_KEY: this.configService.get<string>('MAILER_SECRET_KEY') as string,
    };
  }

  get googleService() {
    return {
      ID: this.configService.get<string>('AUTH_GOOGLE_ID') as string,
      SECRET: this.configService.get<string>('AUTH_GOOGLE_SECRET') as string,
    };
  }

  get jwt() {
    return {
      SECRET: this.configService.get<string>('JWT_SECRET') as string,
      JWT_EXPIRES_IN: this.configService.get<string>(
        'JWT_EXPIRES_IN',
      ) as string,
    };
  }

  get redis() {
    return {
      URL: this.configService.get<string>('REDIS_URL') as string,
    };
  }
}
