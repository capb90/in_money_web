import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
