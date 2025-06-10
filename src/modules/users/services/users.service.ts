import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/IUsers.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { BcryptService } from '@shared/services/bcrypt.service';
import { UserResponseDto } from '@users/dtos/user-response.dto';
import { transformToDto } from '@shared/utils/transform-to-dto.util';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly repository: IUserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  public async createUser(body: CreateUserDto): Promise<UserResponseDto> {
    const passwordEncrypt = await this.bcryptService.hash(body.password);
    const userDb = this.repository.create({
      ...body,
      password: passwordEncrypt,
    });
    return transformToDto(UserResponseDto, userDb);
  }
}
