import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public emailVerified: Date;

  @Expose()
  public image: string;

  @Expose()
  public verifyEmail: boolean;

  @Expose()
  public active: boolean;

  @Expose()
  public lastLogin: Date;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;
}
