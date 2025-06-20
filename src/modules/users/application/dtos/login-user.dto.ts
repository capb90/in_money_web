import { ApiProperty } from '@nestjs/swagger';
import {
  IsValidEmail,
  IsValidPassword,
} from '@users/infrastructure/decorators/validations.decorators';
import { IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsValidEmail()
  public email: string;

  @ApiProperty()
  @IsValidPassword(() => false)
  public password: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;
}
