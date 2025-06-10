import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@users/services/users.service';
import { CreateUserDto } from '@users/dtos/create-user.dto';
import { IApiResponseDto } from '@shared/interfaces/api-response.interfaces';
import { UserResponseDto } from '@users/dtos/user-response.dto';
import { ApiResponseFactory } from '@shared/factories/api-response.factory';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IApiResponseDto<UserResponseDto>> {
    const userResponse = await this.userService.createUser(createUserDto);

    return ApiResponseFactory.success(userResponse, {
      message: 'Usuario agregado a la base de datos',
    });
  }
}
