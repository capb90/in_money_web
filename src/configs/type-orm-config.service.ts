import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AppConfigService } from './app-config.service';
import { User } from 'src/modules/users/domain/entities/user.entity';

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
      entities: [User],
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
