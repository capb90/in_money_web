import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '@users/application/dtos/user-response.dto';
import { ApiSuccessResponseDto } from '@shared/dtos/api-response.dto';
import {
  ApiErrorResponseData,
  ApiOkResponseData,
} from '@shared/swagger/common.swagger';

export function AuthControllerDocs() {
  return applyDecorators(ApiTags('Auth'));
}

export function RegisterDocs() {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, UserResponseDto),
    ApiOperation({ summary: 'Register users in database' }),
    ApiOkResponseData(
      UserResponseDto,
      HttpStatus.CREATED,
      'Created user successfully',
    ),
    ApiErrorResponseData(HttpStatus.BAD_REQUEST, 'User already exists'),
  );
}
