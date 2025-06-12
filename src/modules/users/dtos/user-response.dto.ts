import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserResponseDto {
  @ApiProperty()
  @Expose()
  public id: string;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public emailVerified: Date;

  @ApiProperty()
  @Expose()
  public image: string;

  @ApiProperty()
  @Expose()
  public verifyEmail: boolean;

  @ApiProperty()
  @Expose()
  public active: boolean;

  @ApiProperty()
  @Expose()
  public lastLogin: Date;

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty()
  @Expose()
  public updatedAt: Date;
}
