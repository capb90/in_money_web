export interface IApiErrors {
  message: string[];
  error: string;
  statusCode: number;
}

export interface IApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  meta: Record<string, unknown> | null;
  errors: IApiErrors | null;
}