import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService, I18nAppService } from '@app/configs';
import { UsersService } from '@users/services/users.service';
import { UserResponseDto } from '@users/dtos/user-response.dto';
import { ErrorResponseFactory } from '@shared/factories/error-response.factory';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: AppConfigService,
    private userService: UsersService,
    private i18n: I18nAppService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.SECRET,
    });
  }

  async validate(payload: IJwtPayload): Promise<UserResponseDto> {
    const userDto = await this.userService.validateUserById(payload.sub);

    if (!userDto || userDto.tokenVersion !== payload.tokenVersion) {
      throw ErrorResponseFactory.unauthorized({
        message: await this.i18n.translate('errors.auth.unauthorized'),
      });
    }

    return userDto;
  }
}
