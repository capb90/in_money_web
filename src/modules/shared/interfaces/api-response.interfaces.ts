import { IApiErrors } from '@shared/dtos/api-error.dto';

export interface IApiResponseDto<T> {
  success: boolean;
  message: string | null;
  data: T;
  meta: Record<string, unknown> | null;
  errors: IApiErrors | null;
}
