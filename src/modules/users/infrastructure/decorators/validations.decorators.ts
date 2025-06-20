import { applyDecorators } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Transform, TransformFnParams } from 'class-transformer';

export function IsValidName() {
  return applyDecorators(
    IsString({
      message: i18nValidationMessage('validation.user.name.IsString'),
    }),
    IsNotEmpty({
      message: i18nValidationMessage('validation.user.name.IsNotEmpty'),
    }),
    MinLength(2, {
      message: i18nValidationMessage('validation.user.name.MinLength'),
    }),
    MaxLength(50, {
      message: i18nValidationMessage('validation.user.name.MaxLength'),
    }),
    Transform(({ value }: TransformFnParams): string => value?.trim()),
  );
}

export function IsValidEmail() {
  return applyDecorators(
    IsEmail(
      {},
      { message: i18nValidationMessage('validation.user.email.IsEmail') },
    ),
    IsNotEmpty({
      message: i18nValidationMessage('validation.user.email.IsNotEmpty'),
    }),
    MaxLength(100, {
      message: i18nValidationMessage('validation.user.email.MaxLength'),
    }),
    Transform(({ value }: TransformFnParams): string =>
      value?.toLowerCase().trim(),
    ),
  );
}

export function IsValidPassword(
  validatePassword: (object: any, value: any) => boolean = () => true,
) {
  return applyDecorators(
    IsString({
      message: i18nValidationMessage('validation.user.password.IsString'),
    }),
    IsNotEmpty({
      message: i18nValidationMessage('validation.user.password.IsNotEmpty'),
    }),
    IsSecurePassword(validatePassword),
  );
}

export function IsSecurePassword(
  condition: (object: any, value: any) => boolean = () => true,
) {
  return applyDecorators(
    ValidateIf(condition),
    IsStrongPassword(
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
    ),
  );
}
