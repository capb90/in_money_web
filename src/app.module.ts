import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from '@users/users.module';
import { AppConfigsModule, DataBaseModule } from '@app/configs';

@Module({
  imports: [AuthModule, UsersModule, AppConfigsModule, DataBaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
