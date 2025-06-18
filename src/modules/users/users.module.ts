import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { TypeOrmUsersRepository } from './repositories/typeorm-users.repository';
import { SharedModule } from '@shared/shared.module';
import { Session } from './entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session]), SharedModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
