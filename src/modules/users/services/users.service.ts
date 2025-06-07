import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/IUsers.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly repository: IUserRepository,
  ) {}

  public async createUser(body: CreateUserDto): Promise<User> {
    return this.repository.create(body);
  }
}
