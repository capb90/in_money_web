import { ApiProperty } from '@nestjs/swagger';
import {
  IsValidEmail,
  IsValidPassword,
} from '@users/decorators/validations.decorators';

export class LoginUserDto {
  @ApiProperty()
  @IsValidEmail()
  public email: string;

  @ApiProperty()
  @IsValidPassword(() => false)
  public password: string;
}
