import { Session } from '@auth/domain/entities/session.entity';
import { CreateSessionDto } from '@auth/application/dtos/create-session.dto';

export interface SessionRepositoryInterface {
  create(sessionDto: CreateSessionDto): Promise<Session>;
  findByIdAndUser(sessionId: string, userId: string): Promise<Session | null>;
  update(id: string, body: Partial<Session>): Promise<Session>;
}
