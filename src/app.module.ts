import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppConfigsModule, DataBaseModule } from '@app/configs';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AppConfigsModule,
    DataBaseModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
