import { SessionRepositoryInterface } from '@auth/domain/repositories/session.repository.interface';
import { Session } from '@auth/domain/entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSessionDto } from '@auth/application/dtos/create-session.dto';
import { Injectable } from '@nestjs/common';
import { I18nAppService } from '@app/configs';
import { ErrorResponseFactory } from '@shared/factories/error-response.factory';

@Injectable()
export class SessionRepository implements SessionRepositoryInterface {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly i18n: I18nAppService,
  ) {}

  public async create(sessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create(sessionDto);

    return this.sessionRepository.save(session);
  }

  public async findByIdAndUser(
    sessionId: string,
    userId: string,
  ): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        id: sessionId,
      },
    });
  }

  public async update(id: string, body: Partial<Session>): Promise<Session> {
    const session = await this.sessionRepository.preload({
      id,
      ...body,
    });

    if (!session) {
      const keyEntity = await this.i18n.translate('common.entities.session');
      const message = await this.i18n.translate('errors.notFountResource', {
        entity: keyEntity,
      });

      throw ErrorResponseFactory.notFound({
        message: message,
      });
    }

    return this.sessionRepository.save(session);
  }
}
