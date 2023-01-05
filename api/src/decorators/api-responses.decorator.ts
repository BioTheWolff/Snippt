import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ValidationErrorResponse } from '../types/api-responses.type';

export function ApiResponseValidationError() {
  return applyDecorators(
    ApiResponse({
        status: 400,
        description: 'The validation failed on one of the fields',
        type: ValidationErrorResponse
    })
  );
}

export function ApiResponseUnauthorized() {
  return applyDecorators(
    ApiResponse({ 
      status: 401,
      description: "The user making the request is not authenticated"
    })
  );
}

export function ApiResponseForbidden() {
  return applyDecorators(
    ApiResponse({ 
      status: 403,
      description: "The user is not authorized to make this action. This happens if you try to update another user"
    })
  );
}