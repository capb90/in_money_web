import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@users/services/users.service';
import { CreateUserDto } from '@users/dtos/create-user.dto';
import { User } from '@users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }
}
