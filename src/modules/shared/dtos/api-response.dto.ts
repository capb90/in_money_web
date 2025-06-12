import { IApiResponseDto } from '../interfaces/api-response.interfaces';
import { ApiErrorDto, IApiErrors } from '@shared/dtos/api-error.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ApiSuccessResponseDto<T> implements IApiResponseDto<T> {
  @ApiProperty()
  public data: T;

  @ApiProperty({ default: null })
  public errors: ApiErrorDto | null = null;

  @ApiProperty({ default: 'Success' })
  public message: string;

  @ApiProperty({ default: null })
  public meta: Record<string, unknown> | null;

  @ApiProperty({ default: true })
  public success: boolean = true;

  constructor(
    data: T,
    message: string = 'Success',
    meta: Record<string, unknown> | null = null,
  ) {
    this.data = data;
    this.message = message;
    this.meta = meta;
  }
}

export class ApiErrorResponseDto implements IApiResponseDto<null> {
  @ApiProperty({ type: 'null', default: null })
  public data: null = null;

  @ApiProperty()
  public errors: ApiErrorDto;

  @ApiProperty({ default: null })
  public message: string | null = null;

  @ApiProperty()
  public meta: Record<string, unknown> | null;

  @ApiProperty({ default: false })
  public success: boolean = false;

  constructor(errors: IApiErrors, meta: Record<string, unknown> | null = null) {
    this.errors = errors;
    this.meta = meta;
  }
}
