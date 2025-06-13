import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.user.name.IsString') })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.name.IsNotEmpty'),
  })
  @MinLength(2, {
    message: i18nValidationMessage('validation.user.name.MinLength'),
  })
  @MaxLength(50, {
    message: i18nValidationMessage('validation.user.name.MaxLength'),
  })
  @Transform(({ value }: TransformFnParams): string => value?.trim())
  public name: string;

  @ApiProperty()
  @IsEmail(
    {},
    { message: i18nValidationMessage('validation.user.email.IsEmail') },
  )
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.email.IsNotEmpty'),
  })
  @MaxLength(100, {
    message: i18nValidationMessage('validation.user.email.MaxLength'),
  })
  @Transform(({ value }: TransformFnParams): string =>
    value?.toLowerCase().trim(),
  )
  public email: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.user.password.IsString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.password.IsNotEmpty'),
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: i18nValidationMessage(
        'validation.user.password.IsStrongPassword',
      ),
    },
  )
  public password: string;
}
