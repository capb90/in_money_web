import { ISessionRepository } from '../interfaces/ISession.repository';
import { Session } from '../entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSessionDto } from '../dtos/create-session.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  public async create(sessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create(sessionDto);

    return this.sessionRepository.save(session);
  }
}
