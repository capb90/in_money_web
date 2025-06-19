import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public refreshTokenHash: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public deviceInfo?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  public revokeAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public userId: string;
}
