import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AppConfigService } from '@app/configs';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private appConfigService: AppConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const configs = this.appConfigService.dataBase;
    return {
      type: 'postgres',
      host: configs.DB_HOST,
      port: configs.DB_PORT,
      username: configs.DB_USER,
      password: configs.DB_PASSWORD,
      database: configs.DB_NAME,
      entities: [process.cwd() + 'src/**/domain/entities/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
      synchronize: false,

      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
      },
    };
  }
}
