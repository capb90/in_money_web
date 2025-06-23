import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { UsersService } from '@users/application/services/users.service';
import { CreateUserDto } from '@users/application/dtos/create-user.dto';
import { IApiResponseDto } from '@shared/interfaces/api-response.interfaces';
import { UserResponseDto } from '@users/application/dtos/user-response.dto';
import { ApiResponseFactory } from '@shared/factories/api-response.factory';
import {
  AuthControllerDocs,
  LoginDocs,
  RegisterDocs,
} from '@auth/infrastructure/swagger/auth.swagger';
import { I18nAppService } from '@app/configs';
import { LoginUserDto } from '@users/application/dtos/login-user.dto';
import { AuthService } from '@auth/application/services/auth.service';
import { Response } from 'express';

@AuthControllerDocs()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly i18Service: I18nAppService,
  ) {}

  @Post('register')
  @RegisterDocs()
  @HttpCode(HttpStatus.CREATED)
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IApiResponseDto<UserResponseDto>> {
    const userResponse = await this.userService.createUser(createUserDto);

    return ApiResponseFactory.success(userResponse, {
      message: await this.i18Service.translate('responses.user.Register'),
    });
  }

  @Post('login')
  @LoginDocs()
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() userCredentials: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponseDto<UserResponseDto>> {
    const userDto = await this.userService.validateUserLogin(userCredentials);
    const { tokens, session } =
      await this.authService.generateTokenAndSession(userDto);

    await this.userService.updateLastLogin(userDto.id);
    this.authService.setTokenCookie(res, tokens.refreshToken);

    return ApiResponseFactory.success(userDto, {
      meta: {
        accessToken: tokens.accessToken,
        sessionId: session.id,
      },
    });
  }
}
