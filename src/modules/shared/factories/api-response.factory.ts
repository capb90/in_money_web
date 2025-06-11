import { IApiResponseDto } from '../interfaces/api-response.interfaces';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '../dtos/api-response.dto';
import { IApiErrors } from '@shared/dtos/api-error.dto';

export class ApiResponseFactory {
  static success<T>(
    data: T,
    options?: {
      message?: string;
      meta?: Record<string, unknown> | null;
    },
  ): IApiResponseDto<T> {
    return new ApiSuccessResponseDto(
      data,
      options?.message || 'Success',
      options?.meta,
    );
  }

  static error(
    errors: IApiErrors,
    options?: {
      meta?: Record<string, unknown> | null;
    },
  ): IApiResponseDto<null> {
    return new ApiErrorResponseDto(errors, options?.meta);
  }
}
