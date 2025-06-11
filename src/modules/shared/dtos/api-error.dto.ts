export interface IApiErrors {
  messages: string[];
  statusCode: number;
}

export class ApiErrorDto implements IApiErrors {
  messages: string[];
  statusCode: number;

  constructor(message: string[] | string, statusCode: number) {
    this.statusCode = statusCode;
    if (Array.isArray(message)) {
      this.messages = message;
    } else {
      this.messages = [message];
    }
  }
}
