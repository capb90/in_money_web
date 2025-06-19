import { Inject, Injectable } from '@nestjs/common';
import { ISessionRepository } from '../interfaces/ISession.repository';
import { BcryptService } from '@shared/services/bcrypt.service';
import { AppConfigService, I18nAppService } from '@app/configs';
import { transformToDto } from '@shared/utils/transform-to-dto.util';
import { SessionResponseDto } from '@auth/dtos/session-response.dto';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtGenerate,
  IJwtPayload,
} from '@auth/interfaces/jwt-payload.interface';
import { UserResponseDto } from '@users/dtos/user-response.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepository: ISessionRepository,
    private readonly bcryptService: BcryptService,
    private readonly i18n: I18nAppService,
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
    user: UserResponseDto,
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
}
