import { ApiProperty } from '@nestjs/swagger';
import {
  IsValidEmail,
  IsValidName,
  IsValidPassword,
} from '@users/infrastructure/decorators/validations.decorators';

export class CreateUserDto {
  @ApiProperty()
  @IsValidName()
  public name: string;

  @ApiProperty()
  @IsValidEmail()
  public email: string;

  @ApiProperty()
  @IsValidPassword()
  public password: string;
}
