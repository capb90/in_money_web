import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/IUsers.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { BcryptService } from '@shared/services/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly repository: IUserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  public async createUser(body: CreateUserDto): Promise<User> {
    const passwordEncrypt = await this.bcryptService.hash(body.password);
    return this.repository.create({
      ...body,
      password: passwordEncrypt,
    });
  }
}
