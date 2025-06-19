import { Inject, Injectable } from '@nestjs/common';
import { ISessionRepository } from '../interfaces/ISession.repository';
import { BcryptService } from '@shared/services/bcrypt.service';
import { I18nAppService } from '@app/configs';
import { transformToDto } from '@shared/utils/transform-to-dto.util';
import { SessionResponseDto } from '@auth/dtos/session-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepository: ISessionRepository,
    private readonly bcryptService: BcryptService,
    private readonly i18n: I18nAppService,
  ) {}

  public async createSession(
    refreshToken: string,
    userId: string,
    deviceInfo?: string,
  ) {
    const refreshTokenEncrypt = await this.bcryptService.hash(refreshToken);

    const sessionDb = this.sessionRepository.create({
      refreshTokenHash: refreshTokenEncrypt,
      revokeAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId,
      deviceInfo,
    });

    return transformToDto(SessionResponseDto, sessionDb);
  }
}
