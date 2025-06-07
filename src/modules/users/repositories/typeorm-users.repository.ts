import { IUserRepository } from '../interfaces/IUsers.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class TypeOrmUsersRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const userDb = this.userRepository.create(createUserDto);
    return this.userRepository.save(userDb);
  }
}
