import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class SessionResponseDto {
  @ApiProperty()
  @Expose()
  public id: string;

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty()
  @Expose()
  public revokeAt: Date;
}
