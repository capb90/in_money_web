import { IUserRepository } from '@users/domain/repositories/users.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@users/application/dtos/create-user.dto';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const userDb = this.userRepository.create(createUserDto);
    return this.userRepository.save(userDb);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  public async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
