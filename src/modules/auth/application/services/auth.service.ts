import { Inject, Injectable } from '@nestjs/common';
import { SessionRepositoryInterface } from '@auth/domain/repositories/session.repository.interface';
import { BcryptService } from '@shared/services/bcrypt.service';
import { AppConfigService, I18nAppService } from '@app/configs';
import { transformToDto } from '@shared/utils/transform-to-dto.util';
import { SessionResponseDto } from '@auth/application/dtos/session-response.dto';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtGenerate,
  IJwtPayload,
} from '@auth/domain/interfaces/jwt-payload.interface';
import { UserExtendDto } from '@users/application/dtos/user-response.dto';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { ErrorResponseFactory } from '@shared/factories/error-response.factory';
import { UsersService } from '@users/application/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SessionRepositoryInterface')
    private readonly sessionRepository: SessionRepositoryInterface,
    private readonly bcryptService: BcryptService,
    private readonly i18n: I18nAppService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
  ) {}

  public async createSession(
    refreshToken: string,
    userId: string,
    sessionId: string,
    deviceInfo?: string,
  ) {
    const refreshTokenEncrypt = await this.bcryptService.hash(refreshToken);

    const sessionDb = this.sessionRepository.create({
      id: sessionId,
      refreshTokenHash: refreshTokenEncrypt,
      revokeAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId,
      deviceInfo,
    });

    return transformToDto(SessionResponseDto, sessionDb);
  }

  public generateJwtToken(payload: IJwtPayload): IJwtGenerate {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshToken.REFRESH_SECRET,
      expiresIn: this.appConfigService.jwtRefreshToken.EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.appConfigService.jwtRefreshToken.EXPIRES_IN,
    };
  }

  public async generateTokenAndSession(
    user: UserExtendDto,
    deviceInfo?: string,
  ): Promise<{
    tokens: IJwtGenerate;
    session: SessionResponseDto;
  }> {
    const sessionDb = randomUUID();

    const tokens = this.generateJwtToken({
      sub: user.id,
      jti: sessionDb,
      tokenVersion: user.tokenVersion,
    });

    const session = await this.createSession(
      tokens.refreshToken,
      user.id,
      sessionDb,
      deviceInfo,
    );

    return { tokens, session };
  }

  public setTokenCookie(
    res: Response,
    token: string,
    cookieName: string = 'refreshToken',
  ) {
    const isProduction = this.appConfigService.nodeEnv === 'production';

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/auth',
    });
  }

  public async refreshAccessToken(refreshToken: string): Promise<{
    tokens: IJwtGenerate;
    session: SessionResponseDto;
  }> {
    const messageError = await this.i18n.translate('errors.auth.unauthorized');
    let payload: IJwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.appConfigService.jwtRefreshToken.REFRESH_SECRET,
      });
    } catch {
      throw ErrorResponseFactory.unauthorized({
        message: messageError,
      });
    }

    const user = await this.userService.validateUserById(payload.sub);

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw ErrorResponseFactory.unauthorized({ message: messageError });
    }

    const session = await this.sessionRepository.findByIdAndUser(
      payload.jti,
      payload.sub,
    );

    if (!session || session.isRevoked || session.revokeAt < new Date()) {
      throw ErrorResponseFactory.unauthorized({ message: messageError });
    }

    const isTokenValid = await this.bcryptService.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isTokenValid) {
      throw ErrorResponseFactory.unauthorized({ message: messageError });
    }

    await this.sessionRepository.update(session.id, { isRevoked: true });

    return this.generateTokenAndSession(user);
  }
}
