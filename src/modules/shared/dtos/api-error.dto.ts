import { IApiErrors } from '../interfaces/api-response.interfaces';

export class ApiErrorDto implements IApiErrors {
  message: string[];
  statusCode: number;

  constructor(message: string[] | string, statusCode: number) {
    this.statusCode = statusCode;
    if (Array.isArray(message)) {
      this.message = message;
    } else {
      this.message = [message];
    }
  }
}
