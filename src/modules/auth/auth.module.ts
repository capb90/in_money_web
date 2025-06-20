import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '@users/users.module';
import { SessionRepository } from '@auth/infrastructure/repositories/session.repository';
import { AuthService } from '@auth/application/services/auth.service';
import { Session } from '@auth/domain/entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@auth/infrastructure/configs/jwt.configs';
import { AppConfigService, AppConfigsModule } from '@app/configs';
import { JwtStrategy } from '@auth/infrastructure/strategies/jwt.strategy';

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
      provide: 'SessionRepositoryInterface',
      useClass: SessionRepository,
    },
  ],
})
export class AuthModule {}
