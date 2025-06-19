import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '@users/users.module';
import { SessionRepository } from './repositories/session.repository';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'ISessionRepository',
      useClass: SessionRepository,
    },
  ],
})
export class AuthModule {}
