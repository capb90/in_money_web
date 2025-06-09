import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser un cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  @Transform(({ value }: TransformFnParams): string => value?.trim())
  name: string;

  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @MaxLength(100, { message: 'El email no puede exceder 100 caracteres' })
  @Transform(({ value }: TransformFnParams): string =>
    value?.toLowerCase().trim(),
  )
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'La contraseña debe contener al menos: 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo',
    },
  )
  password: string;
}
