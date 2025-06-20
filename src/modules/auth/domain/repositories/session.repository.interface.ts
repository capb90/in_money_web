import { Session } from '@auth/domain/entities/session.entity';
import { CreateSessionDto } from '@auth/application/dtos/create-session.dto';

export interface SessionRepositoryInterface {
  create(sessionDto: CreateSessionDto): Promise<Session>;
}
