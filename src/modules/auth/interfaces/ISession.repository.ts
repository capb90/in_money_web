import { Session } from '../entities/session.entity';
import { CreateSessionDto } from '../dtos/create-session.dto';

export interface ISessionRepository {
  create(sessionDto: CreateSessionDto): Promise<Session>;
}
