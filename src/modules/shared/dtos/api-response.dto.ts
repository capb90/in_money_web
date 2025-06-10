import {
  IApiErrors,
  IApiResponseDto,
} from '../interfaces/api-response.interfaces';

export class ApiSuccessResponseDto<T> implements IApiResponseDto<T> {
  public data: T;
  public errors: IApiErrors | null = null;
  public message: string;
  public meta: Record<string, unknown> | null;
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
  public data: null = null;
  public errors: IApiErrors;
  public message: string;
  public meta: Record<string, unknown> | null;
  public success: boolean = false;

  constructor(
    errors: IApiErrors,
    message: string = 'Error',
    meta: Record<string, unknown> | null = null,
  ) {
    this.errors = errors;
    this.message = message;
    this.meta = meta;
  }
}
