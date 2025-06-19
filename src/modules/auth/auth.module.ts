import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '@users/users.module';
import { SessionRepository } from './repositories/session.repository';
import { AuthService } from './services/auth.service';
import { Session } from './entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@auth/configs/jwt.configs';
import { AppConfigService, AppConfigsModule } from '@app/configs';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    SharedModule,
    TypeOrmModule.forFeature([Session]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigsModule],
      useFactory: jwtConfig,
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'ISessionRepository',
      useClass: SessionRepository,
    },
  ],
})
export class AuthModule {}
