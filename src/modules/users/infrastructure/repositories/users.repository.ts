import { IUserRepository } from '@users/domain/repositories/users.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@users/application/dtos/create-user.dto';
import { I18nAppService } from '@app/configs';
import { ErrorResponseFactory } from '@shared/factories/error-response.factory';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18n: I18nAppService,
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

  public async update(id: string, body: Partial<User>): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...body,
    });

    if (!user) {
      const keyEntity = await this.i18n.translate('common.entities.user');
      const message = await this.i18n.translate('errors.notFountResource', {
        entity: keyEntity,
      });
      throw ErrorResponseFactory.notFound({
        message: await this.i18n.translate(message),
      });
    }

    return this.userRepository.save(user);
  }
}
