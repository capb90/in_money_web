import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { SharedModule } from '@shared/shared.module';
import { Session } from '../auth/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session]), SharedModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
