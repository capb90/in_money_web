import { AppConfigService } from '@app/configs';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (
  configService: AppConfigService,
): JwtModuleOptions => ({
  secret: configService.jwt.SECRET,
  signOptions: {
    expiresIn: configService.jwt.JWT_EXPIRES_IN,
  },
});
