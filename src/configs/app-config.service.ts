import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') as string;
  }

  get port(): number {
    return this.configService.get<number>('PORT') as number;
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX') as string;
  }
}
