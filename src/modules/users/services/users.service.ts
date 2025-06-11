import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/IUsers.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { BcryptService } from '@shared/services/bcrypt.service';
import { UserResponseDto } from '@users/dtos/user-response.dto';
import { transformToDto } from '@shared/utils/transform-to-dto.util';
import { ErrorResponseFactory } from '@shared/factories/error-response.factory';
import { I18nAppService } from '@app/configs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly repository: IUserRepository,
    private readonly bcryptService: BcryptService,
    private readonly i18n: I18nAppService,
  ) {}

  public async createUser(body: CreateUserDto): Promise<UserResponseDto> {
    const userExists = await this.repository.findByEmail(body.email);
    if (userExists) {
      const message = await this.i18n.translate('errors.auth.EMAIL_EXIST');
      throw ErrorResponseFactory.badRequest({
        message,
      });
    }

    const passwordEncrypt = await this.bcryptService.hash(body.password);
    const userDb = this.repository.create({
      ...body,
      password: passwordEncrypt,
    });
    return transformToDto(UserResponseDto, userDb);
  }
}
