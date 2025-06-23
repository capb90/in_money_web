import { User } from '@users/domain/entities/user.entity';
import { CreateUserDto } from '@users/application/dtos/create-user.dto';
import { UserResponseDto } from '@users/application/dtos/user-response.dto';

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, body: Partial<UserResponseDto>): Promise<User>;
}
