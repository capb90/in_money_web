import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@users/domain/repositories/users.repository.interface';
import { CreateUserDto } from '@users/application/dtos/create-user.dto';
import { BcryptService } from '@shared/services/bcrypt.service';
import {
  UserExtendDto,
  UserResponseDto,
} from '@users/application/dtos/user-response.dto';
import { transformToDto } from '@shared/utils/transform-to-dto.util';
import { ErrorResponseFactory } from '@shared/factories/error-response.factory';
import { I18nAppService } from '@app/configs';
import { LoginUserDto } from '@users/application/dtos/login-user.dto';

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
      const message = await this.i18n.translate(
        'errors.auth.emailAlreadyExist',
      );
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

  public async validateUserLogin(body: LoginUserDto): Promise<UserExtendDto> {
    const userExists = await this.repository.findByEmail(body.email);
    if (!userExists) {
      const message = await this.i18n.translate(
        'errors.auth.invalidCredentials',
      );
      throw ErrorResponseFactory.badRequest({
        message,
      });
    }

    const isPasswordMatch = await this.bcryptService.compare(
      body.password,
      userExists.password as string,
    );

    if (!isPasswordMatch) {
      const message = await this.i18n.translate(
        'errors.auth.invalidCredentials',
      );
      throw ErrorResponseFactory.badRequest({
        message,
      });
    }

    return transformToDto(UserExtendDto, userExists);
  }

  public async updateLastLogin(id: string): Promise<void> {
    await this.repository.update(id, {
      lastLogin: new Date(),
    });
  }

  public async validateUserById(id: string): Promise<UserExtendDto> {
    const userDb = await this.repository.findById(id);
    return transformToDto(UserExtendDto, userDb);
  }
}
