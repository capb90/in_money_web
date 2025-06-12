import { HttpStatus, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import {
  ApiErrorResponseDto,
  ApiSuccessResponseDto,
} from '../dtos/api-response.dto';

export function ApiOkResponseData<T extends Type<unknown>>(
  model: T,
  status: HttpStatus,
  description: string,
): ReturnType<typeof ApiResponse> {
  return ApiResponse({
    status: status,
    description: description,
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiSuccessResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(model) },
          },
        },
      ],
    },
  });
}

export function ApiErrorResponseData(
  status: HttpStatus,
  description: string,
): ReturnType<typeof ApiResponse> {
  return ApiResponse({
    status: status,
    description: description,
    type: ApiErrorResponseDto,
  });
}
