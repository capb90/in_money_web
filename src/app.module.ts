import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { AppConfigsModule, DataBaseModule } from '@app/configs';
import { I18nAppModule } from '@app/configs';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AppConfigsModule,
    DataBaseModule,
    I18nAppModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
