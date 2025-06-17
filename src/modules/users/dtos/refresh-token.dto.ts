import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;

  @IsOptional()
  @IsString()
  public deviceInfo?: string;
}
