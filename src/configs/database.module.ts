import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app-config.service';
import { TypeOrmConfigService } from './type-orm-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class DataBaseModule {}
