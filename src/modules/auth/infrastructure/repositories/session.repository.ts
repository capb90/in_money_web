import { SessionRepositoryInterface } from '@auth/domain/repositories/session.repository.interface';
import { Session } from '@auth/domain/entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSessionDto } from '@auth/application/dtos/create-session.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionRepository implements SessionRepositoryInterface {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  public async create(sessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create(sessionDto);

    return this.sessionRepository.save(session);
  }
}
