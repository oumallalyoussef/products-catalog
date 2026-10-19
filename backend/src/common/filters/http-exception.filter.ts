import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const statusCode = exception.getStatus();
    const body = exception.getResponse();

    // Les erreurs de validation renvoient un objet { message: string[] },
    // les autres erreurs HTTP une simple string.
    const message =
      typeof body === 'string'
        ? body
        : (body as { message: string | string[] }).message;

    response.status(statusCode).json({
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
