import { TypeOrmBaseRepository } from '@shared/repositories/typeorm-base.repository';
import { IUserRepository } from '../interfaces/IUsers.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class TypeOrmUsersRepository
  extends TypeOrmBaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
