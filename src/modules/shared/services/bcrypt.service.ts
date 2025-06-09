import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(payload: string, saltOrRounds: number = 10): Promise<string> {
    return bcrypt.hash(payload, saltOrRounds);
  }

  async compare(payload: string, hash: string): Promise<boolean> {
    return bcrypt.compare(payload, hash);
  }
}
